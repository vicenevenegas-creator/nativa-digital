import React from 'react';
import { GUIA_COMPATIBILIDAD_FLUIDOS } from '../data/mockData';
import { opcionesBusqueda, formatearEje } from '../lib/catalogo';

function Grupo({ compacto, etiqueta, children }) {
  return (
    <div className={compacto ? 'sidebar-group' : 'form-group'}>
      <label className={compacto ? 'sidebar-label' : 'form-label'}>{etiqueta}</label>
      {children}
    </div>
  );
}

// Desplegables encadenados: marca → modelo → eje → fluido, armados con lo que hay en la base.
// Se usan en el buscador principal y en la barra de filtros de resultados.
export function CamposBusqueda({ searchParams, setSearchParams, catalogo, compacto = false }) {
  const opciones = opcionesBusqueda(catalogo, searchParams);

  return (
    <>
      <Grupo compacto={compacto} etiqueta={compacto ? 'Marca de Bomba' : '🏢 Marca de la Bomba'}>
        <select
          className="form-select"
          value={searchParams.marcaBomba}
          onChange={(e) => setSearchParams({ ...searchParams, marcaBomba: e.target.value, modeloBomba: '', diametro: '', fluido: '' })}
        >
          <option value="">-- Seleccionar Marca --</option>
          {opciones.marcas.map((marca) => <option key={marca} value={marca}>{marca}</option>)}
        </select>
      </Grupo>

      <Grupo compacto={compacto} etiqueta={compacto ? 'Modelo' : '📌 Modelo de la Bomba'}>
        <select
          className="form-select"
          value={searchParams.modeloBomba}
          onChange={(e) => setSearchParams({ ...searchParams, modeloBomba: e.target.value, diametro: '', fluido: '' })}
          disabled={!searchParams.marcaBomba}
        >
          <option value="">{searchParams.marcaBomba ? '-- Seleccionar Modelo --' : '-- Elija Marca Primero --'}</option>
          {opciones.modelos.map((modelo) => <option key={modelo} value={modelo}>{modelo}</option>)}
        </select>
      </Grupo>

      <Grupo compacto={compacto} etiqueta={compacto ? 'Diámetro de Eje' : '📏 Diámetro de Eje'}>
        <select
          className="form-select"
          value={searchParams.diametro}
          onChange={(e) => setSearchParams({ ...searchParams, diametro: e.target.value, fluido: '' })}
        >
          <option value="">-- Todos los Ejes --</option>
          {opciones.ejes.map((eje) => <option key={eje} value={eje}>{formatearEje(eje)}</option>)}
        </select>
      </Grupo>

      <Grupo compacto={compacto} etiqueta={compacto ? 'Fluido' : '🧪 Fluido / Condiciones de Trabajo'}>
        <select
          className="form-select"
          value={searchParams.fluido}
          onChange={(e) => setSearchParams({ ...searchParams, fluido: e.target.value })}
        >
          <option value="">-- Todos los Fluidos --</option>
          {opciones.fluidos.map((fluido) => <option key={fluido} value={fluido}>{fluido}</option>)}
        </select>
      </Grupo>
    </>
  );
}

export default function BuscadorForm({ searchParams, setSearchParams, onSearch, catalogo, cargando, errorCatalogo }) {
  const infoFluido = searchParams.fluido ? GUIA_COMPATIBILIDAD_FLUIDOS[searchParams.fluido] : null;
  const catalogoVacio = !cargando && !errorCatalogo && catalogo.length === 0;

  return (
    <div className="search-card">
      {cargando && <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Cargando catálogo…</p>}
      {errorCatalogo && (
        <p style={{ fontSize: '14px', color: '#991B1B', marginBottom: '12px' }}>
          No se pudo cargar el catálogo ({errorCatalogo}). Probá recargar la página.
        </p>
      )}
      {catalogoVacio && (
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
          El catálogo todavía no tiene bombas cargadas. Mientras tanto, consultanos por WhatsApp.
        </p>
      )}

      <div className="form-grid">
        <CamposBusqueda searchParams={searchParams} setSearchParams={setSearchParams} catalogo={catalogo} />
      </div>

      {/* ASISTENTE QUÍMICO: solo aparece si el fluido coincide con la guía */}
      {infoFluido && (
        <div style={{ marginTop: '16px', backgroundColor: '#FFFFFF', border: `2px solid ${infoFluido.colorBadge}`, borderRadius: '8px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>{infoFluido.icono}</span>
              <strong style={{ fontSize: '14px', color: '#0F172A' }}>Asistente Químico: {searchParams.fluido}</strong>
            </div>
            <span style={{ backgroundColor: infoFluido.colorBadge, color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800 }}>
              Riesgo {infoFluido.nivelRiesgo}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#334155', margin: '4px 0', lineHeight: 1.4 }}>
            {infoFluido.advertencia}
          </p>
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px', borderTop: '1px dashed #E2E8F0', paddingTop: '6px' }}>
            <strong>Recomendación técnica oficial:</strong> {infoFluido.materialesRecomendados}
          </div>
        </div>
      )}

      <button className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '16px' }} onClick={onSearch} disabled={cargando}>
        🔍 Buscar Sello Graphite Compatible
      </button>

      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <a
          href={`https://wa.me/5491138134174?text=${encodeURIComponent('Hola, estoy usando el buscador web y me gustaría recibir asesoramiento y cotización para el sello mecánico compatible con mi bomba.')}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp"
          style={{ width: '100%', padding: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
        >
          💬 ¿No encontrás tu bomba? Consultanos por WhatsApp (11 3813-4174)
        </a>
      </div>
    </div>
  );
}
