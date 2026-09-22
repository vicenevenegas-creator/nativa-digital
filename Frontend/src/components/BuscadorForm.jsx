import React from 'react';
import { MARCAS_BOMBA, MODELOS_BOMBA, MARCAS_SELLO_COMPETIDOR, TIPOS_FLUIDO, GUIA_COMPATIBILIDAD_FLUIDOS } from '../data/mockData';

export default function BuscadorForm({ 
  searchParams, 
  setSearchParams, 
  onSearch, 
  activeCategory, 
  setActiveCategory 
}) {
  const handleMarcaBombaChange = (e) => {
    const nuevaMarca = e.target.value;
    setSearchParams({
      ...searchParams,
      marcaBomba: nuevaMarca,
      modeloBomba: ""
    });
  };

  const modelosDisponibles = searchParams.marcaBomba ? (MODELOS_BOMBA[searchParams.marcaBomba] || []) : [];
  const infoFluido = searchParams.fluido ? GUIA_COMPATIBILIDAD_FLUIDOS[searchParams.fluido] : null;

  return (
    <div className="search-card">
      <div className="search-tabs" style={{ flexWrap: 'wrap', gap: '8px' }}>
        <button 
          className={`tab-btn ${activeCategory === 'bombas' ? 'active' : ''}`}
          onClick={() => setActiveCategory('bombas')}
        >
          ⚙️ Por Bomba
        </button>
        <button 
          className={`tab-btn ${activeCategory === 'sellos' ? 'active' : ''}`}
          onClick={() => setActiveCategory('sellos')}
        >
          🏷️ Por Sello Competidor
        </button>
        <button 
          className={`tab-btn ${activeCategory === 'medidas' ? 'active' : ''}`}
          onClick={() => setActiveCategory('medidas')}
        >
          📏 Por Medidas de Calibre (d₁, d₃, L₃)
        </button>
      </div>


      {activeCategory === 'bombas' && (
        /* Búsqueda por Bomba */
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">🏢 Marca de la Bomba</label>
            <select 
              className="form-select"
              value={searchParams.marcaBomba}
              onChange={handleMarcaBombaChange}
            >
              <option value="">-- Seleccionar Marca --</option>
              {MARCAS_BOMBA.map((marca) => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">📌 Modelo de la Bomba</label>
            <select 
              className="form-select"
              value={searchParams.modeloBomba}
              onChange={(e) => setSearchParams({ ...searchParams, modeloBomba: e.target.value })}
              disabled={!searchParams.marcaBomba}
            >
              <option value="">
                {searchParams.marcaBomba ? "-- Seleccionar Modelo --" : "-- Elija Marca Primero --"}
              </option>
              {modelosDisponibles.map((modelo) => (
                <option key={modelo} value={modelo}>{modelo}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">🧪 Fluido / Condiciones de Trabajo</label>
            <select 
              className="form-select"
              value={searchParams.fluido}
              onChange={(e) => setSearchParams({ ...searchParams, fluido: e.target.value })}
            >
              <option value="">-- Todos los Fluidos --</option>
              {TIPOS_FLUIDO.map((fluido) => (
                <option key={fluido} value={fluido}>{fluido}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">📏 Diámetro de Eje (mm)</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ej: 25 mm (opcional)"
              value={searchParams.diametro}
              onChange={(e) => setSearchParams({ ...searchParams, diametro: e.target.value })}
            />
          </div>
        </div>
      )}

      {activeCategory === 'sellos' && (
        /* Búsqueda por Sello */
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">🏷️ Marca del Sello Competidor</label>
            <select 
              className="form-select"
              value={searchParams.marcaSello}
              onChange={(e) => setSearchParams({ ...searchParams, marcaSello: e.target.value })}
            >
              <option value="">-- Seleccionar Marca de Sello --</option>
              {MARCAS_SELLO_COMPETIDOR.map((marca) => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">🔍 Código / Modelo del Sello</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ej: Type 21, MG1, Roten 3..."
              value={searchParams.tipoSello}
              onChange={(e) => setSearchParams({ ...searchParams, tipoSello: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">🧪 Tipo de Fluido</label>
            <select 
              className="form-select"
              value={searchParams.fluido}
              onChange={(e) => setSearchParams({ ...searchParams, fluido: e.target.value })}
            >
              <option value="">-- Todos los Fluidos --</option>
              {TIPOS_FLUIDO.map((fluido) => (
                <option key={fluido} value={fluido}>{fluido}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">📏 Diámetro de Eje (mm)</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ej: 25 mm (opcional)"
              value={searchParams.diametro}
              onChange={(e) => setSearchParams({ ...searchParams, diametro: e.target.value })}
            />
          </div>
        </div>
      )}

      {activeCategory === 'medidas' && (
        /* Búsqueda por Medidas de Calibre */
        <div>
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>📐</span>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A' }}>Buscador por Calibre Directo (Taller & Metalúrgica)</strong>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Ingresá las medidas tomadas físicamente sobre el eje o el sello viejo para matchear sin importar la marca de la bomba.
                </p>
              </div>
            </div>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="form-group">
              <label className="form-label">
                🎯 Diámetro de Eje <span style={{ color: 'var(--color-primary)' }}>(d₁)</span>
              </label>
              <input 
                type="number" 
                className="form-input"
                placeholder="Ej: 25 mm"
                value={searchParams.diametro || ''}
                onChange={(e) => setSearchParams({ ...searchParams, diametro: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#64748B' }}>Diámetro interior del fuelle / resorte</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                🔘 Diámetro Exterior Alojamiento <span style={{ color: '#2563EB' }}>(d₃)</span>
              </label>
              <input 
                type="number" 
                className="form-input"
                placeholder="Ej: 41 mm (opcional)"
                value={searchParams.diametroExt || ''}
                onChange={(e) => setSearchParams({ ...searchParams, diametroExt: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#64748B' }}>Diámetro exterior de pista fija</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                📏 Longitud de Trabajo <span style={{ color: '#059669' }}>(L₃)</span>
              </label>
              <input 
                type="number" 
                className="form-input"
                placeholder="Ej: 35 mm (opcional)"
                value={searchParams.longitud || ''}
                onChange={(e) => setSearchParams({ ...searchParams, longitud: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#64748B' }}>Altura comprimido en mm</span>
            </div>
          </div>
        </div>
      )}

      {/* ASISTENTE QUÍMICO INTELIGENTE EN TIEMPO REAL */}
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

      <button className="btn btn-primary" style={{ width: '100%', padding: '16px', marginTop: '16px' }} onClick={onSearch}>
        🔍 Buscar Compatibilidad Verificada
      </button>

      {activeCategory === 'sellos' && (
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <a 
            href={`https://wa.me/5491138134174?text=${encodeURIComponent('Hola, estoy usando el buscador web y me gustaría recibir asesoramiento y cotización para el sello mecánico compatible con mi bomba.')}`}
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-whatsapp" 
            style={{ width: '100%', padding: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
          >
            💬 Consultar y Cotizar por WhatsApp Directo (11 3813-4174)
          </a>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Atención comercial inmediata con un cotizador técnico especializado.
          </p>
        </div>
      )}
    </div>
  );
}

