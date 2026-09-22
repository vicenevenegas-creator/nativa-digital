import React from 'react';

export default function Navbar({ currentTab, setCurrentTab, userIdentity, onChangeAccess }) {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <a href="#home" className="logo-brand" onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }}>
          <img 
            src="https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png" 
            alt="Graphite Technologies Logo" 
            className="logo-img"
          />
          <div className="logo-text">GRAPHITE <span>TECHNOLOGIES</span></div>
        </a>

        {userIdentity ? (
          <>
            <ul className="nav-links">
              <li>
                <a 
                  href="#home" 
                  className={`nav-link ${currentTab === 'home' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setCurrentTab('home'); }}
                >
                  Buscador Principal
                </a>
              </li>
              <li>
                <a 
                  href="#resultados" 
                  className={`nav-link ${currentTab === 'resultados' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setCurrentTab('resultados'); }}
                >
                  Catálogo de Sellos
                </a>
              </li>
              {userIdentity.role === 'public' && (
                <li>
                  <a 
                    href="#mis-consultas" 
                    className={`nav-link ${currentTab === 'mis-consultas' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setCurrentTab('mis-consultas'); }}
                  >
                    📋 Mis Consultas Guardadas
                  </a>
                </li>
              )}
              {userIdentity.role === 'empresa' && (
                <li>
                  <a 
                    href="#empresa" 
                    className={`nav-link ${currentTab === 'empresa' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setCurrentTab('empresa'); }}
                  >
                    🔒 Panel Interno Empresa
                  </a>
                </li>
              )}
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)', backgroundColor: 'var(--color-bg-light)', padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)' }}>
                {userIdentity.role === 'empresa' ? '🔒' : '👤'} {userIdentity.name}
              </span>

              <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={onChangeAccess}>
                🔄 Cambiar Portal
              </button>
            </div>
          </>
        ) : (
          <button className="btn btn-primary" onClick={onChangeAccess}>
            🔑 Seleccionar Portal de Ingreso
          </button>
        )}
      </div>
    </nav>
  );
}
