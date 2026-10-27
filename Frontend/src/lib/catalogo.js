// Catálogo real desde Supabase: cada fila de `compatibilidades` trae su sello Graphite.
// El buscador filtra estas filas y los resultados se agrupan por sello.
import { supabase } from '../supabase';

export const IMAGEN_GENERICA = 'https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png';

const ordenar = (lista) => [...new Set(lista)].sort((a, b) => String(a).localeCompare(String(b), 'es', { numeric: true }));

// Acepta una URL completa o una ruta dentro del bucket `sellos` de Storage.
export function urlFoto(ruta) {
  if (!ruta) return null;
  if (/^https?:\/\//i.test(ruta)) return ruta;
  return supabase.storage.from('sellos').getPublicUrl(ruta).data.publicUrl;
}

export async function cargarCatalogo() {
  const { data, error } = await supabase
    .from('compatibilidades')
    .select('marca_bomba, modelo_bomba, eje_mm, fluido, codigo_sello, sellos(codigo, nombre, foto_producto, foto_plano)')
    .order('marca_bomba')
    .order('modelo_bomba');
  if (error) throw error;
  return (data || []).map((fila) => ({ ...fila, eje_mm: Number(fila.eje_mm) }));
}

// En la planilla, fluido «Todos» significa que el sello sirve para cualquier fluido.
const esTodos = (fluido) => String(fluido).trim().toLowerCase() === 'todos';

// Filtra por los campos elegidos en el buscador; los vacíos no filtran.
export function filtrarFilas(filas, { marcaBomba, modeloBomba, diametro, fluido }) {
  return filas.filter((f) =>
    (!marcaBomba || f.marca_bomba === marcaBomba) &&
    (!modeloBomba || f.modelo_bomba === modeloBomba) &&
    (!diametro || f.eje_mm === Number(diametro)) &&
    (!fluido || f.fluido === fluido || esTodos(f.fluido))
  );
}

// Opciones de cada desplegable según lo ya elegido (marca → modelo → eje → fluido).
export function opcionesBusqueda(filas, params) {
  const deMarca = filtrarFilas(filas, { marcaBomba: params.marcaBomba });
  const deModelo = filtrarFilas(deMarca, { modeloBomba: params.modeloBomba });
  const deEje = filtrarFilas(deModelo, { diametro: params.diametro });
  return {
    marcas: ordenar(filas.map((f) => f.marca_bomba)),
    modelos: params.marcaBomba ? ordenar(deMarca.map((f) => f.modelo_bomba)) : [],
    ejes: ordenar(deModelo.map((f) => f.eje_mm)),
    fluidos: ordenar(deEje.map((f) => f.fluido).filter((f) => !esTodos(f)))
  };
}

const formatearEje = (eje) => `${String(eje).replace('.', ',')} mm`;

// Un resultado por sello, con todas las bombas/fluidos de las filas que coincidieron.
// Mantiene los nombres de campo que usan las vistas (codigoEquivalente, marcaBombaCompatible, etc.).
export function agruparPorSello(filas) {
  const porCodigo = new Map();
  for (const f of filas) {
    if (!porCodigo.has(f.codigo_sello)) {
      porCodigo.set(f.codigo_sello, { sello: f.sellos || { codigo: f.codigo_sello, nombre: f.codigo_sello }, aplicaciones: [] });
    }
    porCodigo.get(f.codigo_sello).aplicaciones.push({
      marca: f.marca_bomba, modelo: f.modelo_bomba, eje: f.eje_mm, fluido: f.fluido
    });
  }
  return [...porCodigo.values()].map(({ sello, aplicaciones }) => {
    const bombas = ordenar(aplicaciones.map((a) => `${a.marca} ${a.modelo}`));
    const plano = urlFoto(sello.foto_plano);
    return {
      id: sello.codigo,
      codigo: sello.codigo,
      nombre: sello.nombre,
      codigoEquivalente: sello.nombre,
      imagen: urlFoto(sello.foto_producto) || IMAGEN_GENERICA,
      tieneFoto: Boolean(sello.foto_producto),
      plano,
      planoEsPdf: Boolean(plano && /\.pdf($|\?)/i.test(plano)),
      aplicaciones,
      marcaBombaCompatible: ordenar(aplicaciones.map((a) => a.marca)).join(' / '),
      modeloBombaCompatible: bombas.length > 1 ? `${bombas.length} modelos` : aplicaciones[0].modelo,
      diametroEje: ordenar(aplicaciones.map((a) => a.eje)).map(formatearEje).join(' · '),
      fluidosAptos: ordenar(aplicaciones.map((a) => (esTodos(a.fluido) ? 'Todos los fluidos' : a.fluido)))
    };
  });
}

export { formatearEje };
