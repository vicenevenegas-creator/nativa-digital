// Fotos de producto y planos de los sellos, guardados en el bucket `sellos` de Storage.

export const TIPOS = {
  producto: { columna: 'foto_producto', etiqueta: 'foto', acepta: 'image/*' },
  plano: { columna: 'foto_plano', etiqueta: 'plano', acepta: 'image/*,application/pdf' }
};

// Compara códigos solo por letras y números: «GRUPP-11/4-QQV» = «grupp_11-4-qqv».
const normalizar = (texto) => String(texto).toUpperCase().replace(/[^A-Z0-9]/g, '');

export function extension(nombreArchivo) {
  const m = /\.([a-z0-9]+)$/i.exec(nombreArchivo);
  return m ? m[1].toLowerCase() : '';
}

export function esArchivoValido(tipo, nombreArchivo) {
  const ext = extension(nombreArchivo);
  const imagen = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
  return tipo === 'plano' ? imagen || ext === 'pdf' : imagen;
}

// Ruta única en Storage (la fecha evita que el navegador muestre una versión vieja en caché).
export function rutaArchivo(codigo, tipo, nombreArchivo) {
  const seguro = String(codigo).replace(/[^A-Za-z0-9-]/g, '-');
  return `${seguro}_${tipo}_${Date.now()}.${extension(nombreArchivo)}`;
}

/**
 * Reconoce archivos con nombre «<código>_producto.jpg» o «<código>_plano.pdf».
 * @returns {{ codigo: string, tipo: 'producto'|'plano' } | { error: string }}
 */
export function interpretarNombreArchivo(nombreArchivo, codigos) {
  const base = nombreArchivo.replace(/\.[^.]+$/, '');
  const m = /^(.+?)[\s_-]+(producto|plano)$/i.exec(base);
  if (!m) return { error: 'el nombre tiene que terminar en _producto o _plano' };
  const tipo = m[2].toLowerCase();
  const codigo = codigos.find((c) => normalizar(c) === normalizar(m[1]));
  if (!codigo) return { error: `no hay ningún sello con código «${m[1]}»` };
  if (!esArchivoValido(tipo, nombreArchivo)) {
    return { error: tipo === 'plano' ? 'el plano tiene que ser imagen o PDF' : 'la foto tiene que ser una imagen (jpg, png o webp)' };
  }
  return { codigo, tipo };
}
