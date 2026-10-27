// Lectura y validación de la plantilla Contexto/Plantilla_catalogo_sellos.xlsx.
// No depende del navegador ni de Supabase: recibe las hojas ya leídas
// ([{ sheet, data }]) y devuelve lo que se va a subir, más errores y avisos.

const HOJA_SELLOS = 'Sellos';
const HOJA_COMPAT = 'Compatibilidades';

const COLUMNAS_SELLOS = { codigo: 'Código', nombre: 'Nombre completo' };
const COLUMNAS_COMPAT = {
  marca_bomba: 'Marca bomba',
  modelo_bomba: 'Modelo',
  eje_mm: 'Eje (mm)',
  fluido: 'Fluido',
  codigo_sello: 'Código sello'
};

// Compara títulos sin importar mayúsculas, acentos ni espacios de más.
const clave = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

// Texto limpio: sin espacios al principio, al final ni repetidos en el medio.
const limpiar = (valor) => String(valor ?? '').replace(/\s+/g, ' ').trim();

const filaVacia = (fila) => fila.every((celda) => limpiar(celda) === '');

export function leerEje(valor) {
  if (typeof valor === 'number') return valor;
  const texto = limpiar(valor).replace(/mm$/i, '').trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(texto)) return NaN;
  return Number(texto);
}

function ubicarColumnas(hoja, columnas, errores) {
  const titulos = (hoja.data[0] || []).map(clave);
  const posiciones = {};
  for (const [campo, titulo] of Object.entries(columnas)) {
    const indice = titulos.indexOf(clave(titulo));
    if (indice === -1) {
      errores.push(`Hoja «${hoja.sheet}»: falta la columna «${titulo}».`);
    } else {
      posiciones[campo] = indice;
    }
  }
  return Object.keys(posiciones).length === Object.keys(columnas).length ? posiciones : null;
}

/**
 * @param {{ sheet: string, data: any[][] }[]} hojas  Hojas leídas del Excel.
 * @param {string[]} codigosExistentes  Códigos de sello que ya están en la base.
 */
export function procesarLibro(hojas, codigosExistentes = []) {
  const errores = [];
  const avisos = [];
  const sellos = [];
  const compatibilidades = [];

  const buscarHoja = (nombre) => hojas.find((h) => clave(h.sheet) === clave(nombre));
  const hojaSellos = buscarHoja(HOJA_SELLOS);
  const hojaCompat = buscarHoja(HOJA_COMPAT);

  if (!hojaSellos) errores.push(`Falta la hoja «${HOJA_SELLOS}».`);
  if (!hojaCompat) errores.push(`Falta la hoja «${HOJA_COMPAT}».`);
  if (errores.length) return { sellos, compatibilidades, errores, avisos };

  // --- Sellos ---
  const colSellos = ubicarColumnas(hojaSellos, COLUMNAS_SELLOS, errores);
  const filaDeCodigo = new Map();
  if (colSellos) {
    hojaSellos.data.slice(1).forEach((fila, i) => {
      const nFila = i + 2;
      if (filaVacia(fila)) return;
      const codigo = limpiar(fila[colSellos.codigo]);
      const nombre = limpiar(fila[colSellos.nombre]);
      if (!codigo) return errores.push(`Sellos, fila ${nFila}: falta el código.`);
      if (!nombre) return errores.push(`Sellos, fila ${nFila}: falta el nombre completo de ${codigo}.`);
      if (filaDeCodigo.has(codigo)) {
        return errores.push(`Sellos, fila ${nFila}: el código ${codigo} ya está en la fila ${filaDeCodigo.get(codigo)}.`);
      }
      filaDeCodigo.set(codigo, nFila);
      sellos.push({ codigo, nombre });
    });
  }

  // --- Compatibilidades ---
  const colCompat = ubicarColumnas(hojaCompat, COLUMNAS_COMPAT, errores);
  const codigosValidos = new Set([...filaDeCodigo.keys(), ...codigosExistentes]);
  const vistas = new Map();
  if (colCompat) {
    hojaCompat.data.slice(1).forEach((fila, i) => {
      const nFila = i + 2;
      if (filaVacia(fila)) return;
      const registro = {
        marca_bomba: limpiar(fila[colCompat.marca_bomba]),
        modelo_bomba: limpiar(fila[colCompat.modelo_bomba]),
        eje_mm: leerEje(fila[colCompat.eje_mm]),
        fluido: limpiar(fila[colCompat.fluido]),
        codigo_sello: limpiar(fila[colCompat.codigo_sello])
      };
      const faltan = Object.entries(COLUMNAS_COMPAT)
        .filter(([campo]) => campo !== 'eje_mm' && !registro[campo])
        .map(([, titulo]) => titulo);
      if (limpiar(fila[colCompat.eje_mm]) === '') faltan.push(COLUMNAS_COMPAT.eje_mm);
      if (faltan.length) {
        return errores.push(`Compatibilidades, fila ${nFila}: falta ${faltan.join(', ')}.`);
      }
      if (!Number.isFinite(registro.eje_mm) || registro.eje_mm <= 0 || registro.eje_mm >= 10000) {
        return errores.push(`Compatibilidades, fila ${nFila}: el eje «${fila[colCompat.eje_mm]}» no es un número de milímetros válido.`);
      }
      registro.eje_mm = Math.round(registro.eje_mm * 100) / 100;
      if (!codigosValidos.has(registro.codigo_sello)) {
        return errores.push(`Compatibilidades, fila ${nFila}: el sello ${registro.codigo_sello} no está en la hoja Sellos ni en la base.`);
      }
      const combinacion = [registro.marca_bomba, registro.modelo_bomba, registro.eje_mm, registro.fluido, registro.codigo_sello].join('|');
      if (vistas.has(combinacion)) {
        return avisos.push(`Compatibilidades, fila ${nFila}: repite la fila ${vistas.get(combinacion)}, se carga una sola vez.`);
      }
      vistas.set(combinacion, nFila);
      compatibilidades.push(registro);
    });
  }

  if (!errores.length && !sellos.length && !compatibilidades.length) {
    errores.push('La planilla no tiene datos para cargar.');
  }

  return { sellos, compatibilidades, errores, avisos };
}
