import React from 'react';
import { MARCAS_BOMBA, MODELOS_BOMBA, MARCAS_SELLO_COMPETIDOR, TIPOS_FLUIDO } from '../data/mockData';

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

  return (
    <div className="search-card">
      <div className="search-tabs">
        <button 
          className={`tab-btn ${activeCategory === 'bombas' ? 'active' : ''}`}
          onClick={() => setActiveCategory('bombas')}
        >
          ⚙️ Buscar por Marca y Modelo de Bomba
        </button>
        <button 
          className={`tab-btn ${activeCategory === 'sellos' ? 'active' : ''}`}
          onClick={() => setActiveCategory('sellos')}
        >
          🔧 Buscar por Marca/Código de Sello
        </button>
      </div>

      {activeCategory === 'bombas' ? (
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
            <label className="form-label">💧 Tipo de Fluido / Trabajo</label>
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
      ) : (
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
            <label className="form-label">💧 Tipo de Fluido</label>
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

      <button className="btn btn-primary" style={{ width: '100%', padding: '16px' }} onClick={onSearch}>
        🔍 Buscar Compatibilidad Verificada
      </button>
    </div>
  );
}
