import React from 'react';

export default function Navbar({ currentTab, setCurrentTab, userIdentity, onChangeAccess, currentView, favoritosCount = 0 }) {
  const isAuthView = currentView === 'acceso' || currentView === 'cliente-auth' || currentView === 'empresa-login';

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

        {userIdentity && (
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
            {userIdentity.role === 'cliente' && (
              <>
                <li>
                  <a 
                    href="#favoritos" 
                    className={`nav-link ${currentTab === 'favoritos' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setCurrentTab('favoritos'); }}
                  >
                    ⭐ Favoritos {favoritosCount > 0 && <span className="badge-count" style={{ backgroundColor: '#D20A11', color: 'white', borderRadius: '10px', padding: '2px 7px', fontSize: '11px', marginLeft: '4px' }}>{favoritosCount}</span>}
                  </a>
                </li>
                <li>
                  <a 
                    href="#mis-consultas" 
                    className={`nav-link ${currentTab === 'mis-consultas' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setCurrentTab('mis-consultas'); }}
                  >
                    📋 Cotizaciones WhatsApp
                  </a>
                </li>
              </>
            )}
            {(userIdentity.role === 'vendedor' || userIdentity.role === 'admin') && (
              <li>
                <a 
                  href="#empresa" 
                  className={`nav-link ${currentTab === 'empresa' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); setCurrentTab('empresa'); }}
                >
                  {userIdentity.role === 'admin' ? '👑 Panel de Control Admin' : '🔒 Panel de Ventas CRM'}
                </a>
              </li>
            )}
          </ul>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, whiteSpace: 'nowrap' }}>

          {userIdentity ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span style={{ 
                fontSize: '13px', 
                fontWeight: 700, 
                color: userIdentity.role === 'admin' ? '#991B1B' : (userIdentity.role === 'vendedor' ? '#1E40AF' : 'var(--color-text-main)'), 
                backgroundColor: userIdentity.role === 'admin' ? '#FEE2E2' : (userIdentity.role === 'vendedor' ? '#DBEAFE' : 'var(--color-bg-light)'), 
                padding: '7px 14px', 
                borderRadius: 'var(--radius-pill)', 
                border: '1px solid var(--color-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <span>
                  {userIdentity.role === 'admin' && '👑 Admin: '}
                  {userIdentity.role === 'vendedor' && '👔 Vendedor: '}
                  {userIdentity.role === 'cliente' && '👤 '}
                </span>
                <span>{userIdentity.name}</span>
              </span>

              <button 
                className="btn btn-secondary" 
                style={{ padding: '7px 14px', fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0 }} 
                onClick={onChangeAccess} 
                title="Cerrar sesión o cambiar de perfil"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          ) : (
            !isAuthView && (
              <button className="btn btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }} onClick={onChangeAccess}>
                🔑 Iniciar Sesión / Registrarse
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
