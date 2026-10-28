// Uso del cotizador: cada búsqueda y cada «Cotizar por WhatsApp» queda en `eventos_cotizador`.
import { supabase } from '../supabase';

// No frena la pantalla: si falla el registro, la búsqueda o el WhatsApp siguen igual.
export function registrarEvento(tipo, datos = {}) {
  supabase
    .from('eventos_cotizador')
    .insert({ tipo, ...datos })
    .then(({ error }) => {
      if (error) console.warn(`No se pudo registrar el evento «${tipo}»:`, error.message);
    });
}

export function datosBusqueda({ marcaBomba, modeloBomba, diametro, fluido }) {
  return {
    marca_bomba: marcaBomba || null,
    modelo_bomba: modeloBomba || null,
    eje_mm: diametro ? Number(diametro) : null,
    fluido: fluido || null
  };
}

// Resumen para la pestaña Métricas (la función de la base solo responde al personal).
export async function cargarMetricas() {
  const { data, error } = await supabase.rpc('metricas_cotizador');
  if (error) throw error;
  return data;
}
