import React from 'react';

export default function ResultadosSection({ resultados, onReset, searchParams }) {
  const handleWhatsApp = (sello) => {
    const msg = `Hola Graphite! Vengo de la web y quiero cotizar el sello compatible: ${sello.codigoEquivalente} (${sello.equivalenteCompetidor}) para la bomba ${sello.marcaBombaCompatible} ${sello.modeloBombaCompatible}.`;
    alert(`[Simulación WhatsApp]\nSe abriría el chat con el Cotizador de Graphite:\n\n"${msg}"`);
  };

  return (
    <section className="results-section container" id="resultados">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            Catálogo y Resultados de Compatibilidad ({resultados.length} Modelos)
          </h2>
          {searchParams.marcaBomba ? (
            <p className="section-filter-tag">
              Filtro activo: <strong>{searchParams.marcaBomba}</strong> {searchParams.modeloBomba ? `> ${searchParams.modeloBomba}` : ''} {searchParams.fluido ? `| Fluido: ${searchParams.fluido}` : ''}
            </p>
          ) : (
            <p className="section-filter-tag">
              Mostrando los 15 modelos de sellos mecánicos más solicitados para el MVP.
            </p>
          )}
        </div>
        <button className="btn btn-secondary" onClick={onReset}>
          🔄 Limpiar Filtros
        </button>
      </div>

      {resultados.length === 0 ? (
        <div className="empty-results">
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            No se encontraron repuestos exactos para los filtros seleccionados.
          </p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Pruebe seleccionar únicamente la marca de la bomba o consultar directamente al cotizador técnico.
          </p>
        </div>
      ) : (
        <div className="results-grid">
          {resultados.map((sello) => (
            <div key={sello.id} className="card-product">
              <div className="card-image-box">
                <div className="badge-verified">✓ Matcheo 100%</div>
                <img src={sello.imagen} alt={sello.codigoEquivalente} className="card-seal-img" />
              </div>

              <div className="card-body">
                <div className="card-code">{sello.id}</div>
                <h3 className="card-title">{sello.codigoEquivalente}</h3>
                
                <div className="card-spec">
                  <div className="spec-item">
                    <span className="spec-label">Equivalencia:</span>
                    <span className="spec-val">{sello.equivalenteCompetidor}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Bomba Compatible:</span>
                    <span className="spec-val">{sello.marcaBombaCompatible} - {sello.modeloBombaCompatible}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Diámetro Eje:</span>
                    <span className="spec-val">{sello.diametroEje}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Materiales:</span>
                    <span className="spec-val">{sello.materiales}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <button 
                    className="btn btn-whatsapp full-width"
                    onClick={() => handleWhatsApp(sello)}
                  >
                    💬 Cotizar por WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
