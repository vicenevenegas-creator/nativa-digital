import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BuscadorForm from './components/BuscadorForm';
import Footer from './components/Footer';
import { SELLOS_REPUESSTOS, MARCAS_BOMBA, MODELOS_BOMBA, MARCAS_SELLO_COMPETIDOR, TIPOS_FLUIDO, MOCK_LEADS_CONSULTAS } from './data/mockData';
import './styles/design-system.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('acceso');
  const [currentView, setCurrentView] = useState('acceso'); // 'acceso' | 'home' | 'resultados' | 'detalle' | 'empresa'
  const [userIdentity, setUserIdentity] = useState(null); // { role: 'public' | 'empresa', name: string }
  const [activeCategory, setActiveCategory] = useState('bombas');
  const [selloSeleccionado, setSelloSeleccionado] = useState(SELLOS_REPUESSTOS[0]);
  
  // Estado para el panel de empresa
  const [isEmpresaLoggedIn, setIsEmpresaLoggedIn] = useState(false);
  const [empresaEmail, setEmpresaEmail] = useState('');
  const [empresaPass, setEmpresaPass] = useState('');
  const [empresaSubTab, setEmpresaSubTab] = useState('leads'); // 'leads' | 'carga' | 'calibre'
  const [leadsList, setLeadsList] = useState(MOCK_LEADS_CONSULTAS);
  const [catalogoLocal, setCatalogoLocal] = useState(SELLOS_REPUESSTOS);

  // Formulario nuevo repuesto
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    codigoEquivalente: '',
    equivalenteCompetidor: '',
    marcaSelloCompetidor: 'John Crane',
    marcaBombaCompatible: 'Grundfos',
    modeloBombaCompatible: '',
    diametroEje: '',
    presionMax: '',
    temperaturaMax: '',
    materiales: ''
  });

  const [searchParams, setSearchParams] = useState({
    marcaBomba: '',
    modeloBomba: '',
    marcaSello: '',
    tipoSello: '',
    fluido: '',
    diametro: ''
  });

  const [resultados, setResultados] = useState(catalogoLocal);

  const handleSearch = () => {
    let filtrados = catalogoLocal;

    if (activeCategory === 'bombas') {
      if (searchParams.marcaBomba) {
        filtrados = filtrados.filter(s => s.marcaBombaCompatible.toLowerCase() === searchParams.marcaBomba.toLowerCase());
      }
      if (searchParams.modeloBomba) {
        filtrados = filtrados.filter(s => s.modeloBombaCompatible.toLowerCase().includes(searchParams.modeloBomba.toLowerCase()));
      }
    } else {
      if (searchParams.marcaSello) {
        filtrados = filtrados.filter(s => s.marcaSelloCompetidor.toLowerCase() === searchParams.marcaSello.toLowerCase());
      }
      if (searchParams.tipoSello) {
        filtrados = filtrados.filter(s => 
          s.tipoSelloCompetidor.toLowerCase().includes(searchParams.tipoSello.toLowerCase()) ||
          s.equivalenteCompetidor.toLowerCase().includes(searchParams.tipoSello.toLowerCase())
        );
      }
    }

    if (searchParams.fluido) {
      filtrados = filtrados.filter(s => (s.fluidosAptos || []).some(f => f.toLowerCase().includes(searchParams.fluido.toLowerCase())));
    }

    setResultados(filtrados);
    setCurrentView('resultados');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSearchParams({
      marcaBomba: '',
      modeloBomba: '',
      marcaSello: '',
      tipoSello: '',
      fluido: '',
      diametro: ''
    });
    setResultados(catalogoLocal);
  };

  const handleVerDetalle = (sello) => {
    setSelloSeleccionado(sello);
    setCurrentView('detalle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = (sello) => {
    const msg = `Hola Graphite! Vengo de la web y quiero cotizar el sello compatible: ${sello.codigoEquivalente} (${sello.equivalenteCompetidor}) para la bomba ${sello.marcaBombaCompatible} ${sello.modeloBombaCompatible}.`;
    alert(`[Simulación WhatsApp al 11 3813-4174]\nSe abriría el chat con el Cotizador de Graphite:\n\n"${msg}"`);
  };

  const handleLoginEmpresa = (e) => {
    e.preventDefault();
    if (!empresaEmail.endsWith('@graphite.com.ar') && !empresaEmail.endsWith('@graphite.com')) {
      alert("Acceso denegado: El correo debe ser institucional dominio @graphite.com.ar");
      return;
    }
    setIsEmpresaLoggedIn(true);
    setUserIdentity({ role: 'empresa', name: empresaEmail.split('@')[0] });
  };

  const handleAgregarRepuesto = (e) => {
    e.preventDefault();
    if (!nuevoRepuesto.codigoEquivalente || !nuevoRepuesto.modeloBombaCompatible) {
      alert("Por favor completá los campos obligatorios.");
      return;
    }
    const creado = {
      id: `GRA-NEW-${Math.floor(Math.random()*1000)}`,
      ...nuevoRepuesto,
      medidasDetalle: `Eje: ${nuevoRepuesto.diametroEje || '25mm'}`,
      color: "Acero Inoxidable 316L",
      velocidadMax: "15 m/s",
      imagen: "https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png"
    };

    const actual = [creado, ...catalogoLocal];
    setCatalogoLocal(actual);
    setResultados(actual);
    alert(`¡Repuesto ${creado.codigoEquivalente} agregado exitosamente al catálogo oficial!`);
    setNuevoRepuesto({
      codigoEquivalente: '',
      equivalenteCompetidor: '',
      marcaSelloCompetidor: 'John Crane',
      marcaBombaCompatible: 'Grundfos',
      modeloBombaCompatible: '',
      diametroEje: '',
      presionMax: '',
      temperaturaMax: '',
      materiales: ''
    });
  };

  const handleCambiarEstadoLead = (id, nuevoEstado) => {
    setLeadsList(leadsList.map(l => l.id === id ? { ...l, estado: nuevoEstado } : l));
  };

  return (
    <div>
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setCurrentView(tab);
        }}
        userIdentity={userIdentity}
        onChangeAccess={() => {
          setUserIdentity(null);
          setIsEmpresaLoggedIn(false);
          setCurrentView('acceso');
          setCurrentTab('acceso');
        }}
      />

      {currentView === 'acceso' && (
        <div className="results-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
          <div className="container" style={{ maxWidth: '800px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Bienvenido a Graphite Technologies</h1>
              <p style={{ fontSize: '18px', color: 'var(--color-text-muted)' }}>Por favor, seleccione su portal de ingreso para continuar.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div 
                className="card-product" 
                style={{ padding: '40px 24px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onClick={() => {
                  setUserIdentity({ role: 'public', name: 'Invitado' });
                  setCurrentView('home');
                  setCurrentTab('home');
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>👤</div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Acceso Público</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Para clientes y compradores. Busque repuestos, consulte catálogos y solicite cotizaciones.
                </p>
                <button className="btn btn-primary full-width" style={{ marginTop: 'auto' }}>
                  Ingresar como Cliente
                </button>
              </div>

              <div 
                className="card-product" 
                style={{ padding: '40px 24px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid var(--color-primary)' }}
                onClick={() => {
                  setCurrentView('empresa');
                  setCurrentTab('empresa');
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Acceso Empresa</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Para cotizadores y vendedores con correo institucional @graphite.com.ar.
                </p>
                <button className="btn btn-secondary full-width" style={{ marginTop: 'auto' }}>
                  Ingresar al Panel Interno
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'home' && (
        <section className="hero">
          <div className="hero-bg-motion"></div>
          <div className="container hero-container">
            <span className="hero-tag">Buscador Inteligente Graphite</span>
            <h1 className="hero-title">Encontrá el Sello Mecánico Exacto para tu Bomba</h1>
            <p className="hero-subtitle">
              Seleccioná la marca y modelo de tu bomba o las especificaciones de tu sello actual para obtener matcheos verificados al instante.
            </p>

            <BuscadorForm 
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={handleSearch}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>
        </section>
      )}

      {currentView === 'resultados' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => setCurrentView('home')}>
              ← Volver al Buscador Principal
            </span>

            <div className="results-layout">
              <aside className="sidebar-filters-card">
                <div className="sidebar-title">
                  <span>Filtros Activos</span>
                  <button 
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
                    onClick={handleReset}
                  >
                    Limpiar
                  </button>
                </div>

                <div className="sidebar-group">
                  <label className="sidebar-label">Marca de Bomba</label>
                  <select 
                    className="form-select"
                    value={searchParams.marcaBomba}
                    onChange={(e) => setSearchParams({ ...searchParams, marcaBomba: e.target.value, modeloBomba: '' })}
                  >
                    <option value="">-- Todas las Marcas --</option>
                    {MARCAS_BOMBA.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="sidebar-group">
                  <label className="sidebar-label">Marca de Sello</label>
                  <select 
                    className="form-select"
                    value={searchParams.marcaSello}
                    onChange={(e) => setSearchParams({ ...searchParams, marcaSello: e.target.value })}
                  >
                    <option value="">-- Todas las Marcas --</option>
                    {MARCAS_SELLO_COMPETIDOR.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="sidebar-group">
                  <label className="sidebar-label">Tipo de Fluido</label>
                  <select 
                    className="form-select"
                    value={searchParams.fluido}
                    onChange={(e) => setSearchParams({ ...searchParams, fluido: e.target.value })}
                  >
                    <option value="">-- Todos los Fluidos --</option>
                    {TIPOS_FLUIDO.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <button className="btn btn-primary full-width" onClick={handleSearch}>
                  Aplicar Filtros
                </button>
              </aside>

              <main>
                <div style={{ marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800 }}>
                    Catálogo de Compatibilidad ({resultados.length} Modelos)
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                    Hacé clic en cualquier repuesto para abrir su **Ficha Técnica Dedicada**.
                  </p>
                </div>

                <div className="results-grid">
                  {resultados.map((sello) => (
                    <div key={sello.id} className="card-product" onClick={() => handleVerDetalle(sello)}>
                      <div className="card-image-box">
                        <div className="badge-verified">✓ Matcheo 100%</div>
                        <img src={sello.imagen} alt={sello.codigoEquivalente} className="card-seal-img" />
                      </div>

                      <div className="card-body">
                        <div className="card-code">{sello.id}</div>
                        <h3 className="card-title">{sello.codigoEquivalente}</h3>
                        
                        <div className="card-spec">
                          <div className="spec-item"><span className="spec-label">Equivalencia:</span><span className="spec-val">{sello.equivalenteCompetidor}</span></div>
                          <div className="spec-item"><span className="spec-label">Bomba:</span><span className="spec-val">{sello.marcaBombaCompatible} - {sello.modeloBombaCompatible}</span></div>
                          <div className="spec-item"><span className="spec-label">Eje:</span><span className="spec-val">{sello.diametroEje}</span></div>
                        </div>

                        <div className="card-footer">
                          <button className="btn btn-whatsapp full-width" onClick={(e) => { e.stopPropagation(); handleVerDetalle(sello); }}>
                            🔍 Ver Ficha Técnica Dedicada
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </div>
        </div>
      )}

      {currentView === 'detalle' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => setCurrentView('resultados')}>
              ← Volver al Catálogo de Resultados
            </span>

            <div className="product-detail-layout">
              <div className="detail-img-card">
                <div className="badge-verified" style={{ top: '16px', right: '16px' }}>✓ Matcheo 100% Verificado</div>
                <img src={selloSeleccionado.imagen} alt={selloSeleccionado.codigoEquivalente} className="detail-large-img" />
              </div>

              <div className="detail-main-content">
                <div>
                  <span className="detail-header-tag">{selloSeleccionado.id}</span>
                  <h1 className="detail-title">{selloSeleccionado.codigoEquivalente}</h1>
                </div>

                <div className="tech-limits-container">
                  <div className="tech-limits-title">⚡ Límites Operativos de Trabajo</div>
                  <div className="limits-grid">
                    <div className="limit-item">
                      <div className="limit-val">{selloSeleccionado.presionMax}</div>
                      <div className="limit-lbl">Presión Máxima</div>
                    </div>
                    <div className="limit-item">
                      <div className="limit-val">{selloSeleccionado.temperaturaMax}</div>
                      <div className="limit-lbl">Temperatura Operativa</div>
                    </div>
                    <div className="limit-item">
                      <div className="limit-val">{selloSeleccionado.velocidadMax}</div>
                      <div className="limit-lbl">Velocidad Máx.</div>
                    </div>
                  </div>
                </div>

                <div className="tech-spec-grid">
                  <div className="spec-detail-box">
                    <div className="spec-detail-title">🏢 Bomba Compatible</div>
                    <div className="spec-detail-val">{selloSeleccionado.marcaBombaCompatible} - {selloSeleccionado.modeloBombaCompatible}</div>
                  </div>

                  <div className="spec-detail-box">
                    <div className="spec-detail-title">🔄 Equivalencias Marcas</div>
                    <div className="spec-detail-val">{selloSeleccionado.equivalenteCompetidor}</div>
                  </div>

                  <div className="spec-detail-box">
                    <div className="spec-detail-title">📏 Medidas de Eje</div>
                    <div className="spec-detail-val">{selloSeleccionado.medidasDetalle || selloSeleccionado.diametroEje}</div>
                  </div>

                  <div className="spec-detail-box">
                    <div className="spec-detail-title">🎨 Color / Acabado Visual</div>
                    <div className="spec-detail-val">{selloSeleccionado.color || "Acero Inoxidable 316"}</div>
                  </div>

                  <div className="spec-detail-box" style={{ gridColumn: '1/-1' }}>
                    <div className="spec-detail-title">⚙️ Materiales de Caras y Elastómeros</div>
                    <div className="spec-detail-val">{selloSeleccionado.materiales}</div>
                  </div>
                </div>

                <button className="btn btn-whatsapp" style={{ padding: '16px', fontSize: '16px' }} onClick={() => handleWhatsApp(selloSeleccionado)}>
                  💬 Cotizar por WhatsApp (11 3813-4174)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'cuenta' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => setCurrentView('home')}>
              ← Volver al Inicio
            </span>

            <div className="account-card">
              <div className="account-header-box">
                <div className="account-avatar">G</div>
                <div className="account-info">
                  <h2>Martín Hellwing</h2>
                  <p>Cotizador Técnico Senior · Graphite Technologies Argentina</p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-num">14</div>
                  <div className="stat-lbl">Cotizaciones Hoy</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">52</div>
                  <div className="stat-lbl">Matcheos Realizados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA PRIVADA EXCLUSIVA PARA EMPRESA (@GRAPHITE.COM) */}
      {currentView === 'empresa' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => setCurrentView('home')}>
              ← Volver al Portal Público
            </span>

            {!isEmpresaLoggedIn ? (
              <div style={{ maxWidth: '440px', margin: '40px auto', backgroundColor: 'white', padding: '36px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '32px' }}>🔒</span>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>Acceso Empresa Graphite</h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Módulo exclusivo para vendedores y técnicos con correo @graphite.com.ar</p>
                </div>

                <form onSubmit={handleLoginEmpresa}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Correo Institucional</label>
                    <input 
                      type="email" 
                      className="form-input"
                      placeholder="vendedor@graphite.com.ar"
                      value={empresaEmail}
                      onChange={(e) => setEmpresaEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Contraseña de Acceso</label>
                    <input 
                      type="password" 
                      className="form-input"
                      placeholder="••••••••"
                      value={empresaPass}
                      onChange={(e) => setEmpresaPass(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary full-width" style={{ padding: '14px' }}>
                    🔑 Iniciar Sesión Privada
                  </button>
                </form>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <button 
                    className="btn btn-secondary full-width"
                    onClick={() => {
                      setEmpresaEmail('vendedor@graphite.com.ar');
                      setIsEmpresaLoggedIn(true);
                      setUserIdentity({ role: 'empresa', name: 'vendedor' });
                    }}
                  >
                    ⚡ Acceder como Vendedor Demo
                  </button>
                </div>
              </div>
            ) : (
              <div className="empresa-card">
                <div className="empresa-header">
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Panel Interno de Gestión de Ventas & Catálogo</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Sesión activa: <strong>vendedor@graphite.com.ar</strong></p>
                  </div>
                  <span className="empresa-badge-auth">🔒 Personal Autorizado Graphite</span>
                </div>

                {/* SUB PESTAÑAS DEL PANEL */}
                <div className="search-tabs" style={{ marginBottom: '28px' }}>
                  <button 
                    className={`tab-btn ${empresaSubTab === 'leads' ? 'active' : ''}`}
                    onClick={() => setEmpresaSubTab('leads')}
                  >
                    📥 Consultas & Cotizaciones Web ({leadsList.length})
                  </button>
                  <button 
                    className={`tab-btn ${empresaSubTab === 'carga' ? 'active' : ''}`}
                    onClick={() => setEmpresaSubTab('carga')}
                  >
                    ➕ Carga Masiva de Sellos (ABM)
                  </button>
                </div>

                {empresaSubTab === 'leads' && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>Solicitudes de Cotización Recibidas</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="crm-table">
                        <thead>
                          <tr>
                            <th>ID / Fecha</th>
                            <th>Cliente / Empresa</th>
                            <th>Repuesto Solicitado</th>
                            <th>Bomba Target</th>
                            <th>Estado</th>
                            <th>Acciones Vendedor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leadsList.map(lead => (
                            <tr key={lead.id}>
                              <td>
                                <strong>{lead.id}</strong><br />
                                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{lead.fecha}</span>
                              </td>
                              <td>
                                <strong>{lead.cliente}</strong><br />
                                <span style={{ fontSize: '12px' }}>{lead.contacto} ({lead.telefono})</span>
                              </td>
                              <td><strong>{lead.selloBuscado}</strong></td>
                              <td>{lead.bomba}</td>
                              <td>
                                <span className={`badge-status ${lead.estado.toLowerCase().replace(' ', '')}`}>
                                  {lead.estado}
                                </span>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-whatsapp" 
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                  onClick={() => alert(`Abriendo WhatsApp con ${lead.cliente} al ${lead.telefono}`)}
                                >
                                  💬 Responder
                                </button>
                                <button 
                                  className="btn btn-secondary" 
                                  style={{ padding: '6px 12px', fontSize: '12px', marginLeft: '6px' }}
                                  onClick={() => handleCambiarEstadoLead(lead.id, 'Respondido')}
                                >
                                  ✓ Cerrar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {empresaSubTab === 'carga' && (
                  <form onSubmit={handleAgregarRepuesto} style={{ maxWidth: '680px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Alta de Nuevo Sello Mecánico en el Catálogo</h3>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Código de Sello Graphite</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ej: GRA-T502-30" 
                        value={nuevoRepuesto.codigoEquivalente}
                        onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, codigoEquivalente: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Equivalencia Competidores</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Ej: John Crane Type 502 / Burgmann MG1"
                        value={nuevoRepuesto.equivalenteCompetidor}
                        onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, equivalenteCompetidor: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Marca de Bomba</label>
                        <select 
                          className="form-select"
                          value={nuevoRepuesto.marcaBombaCompatible}
                          onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, marcaBombaCompatible: e.target.value })}
                        >
                          {MARCAS_BOMBA.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Modelo de Bomba</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: CR 15-03"
                          value={nuevoRepuesto.modeloBombaCompatible}
                          onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, modeloBombaCompatible: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Diámetro Eje (mm)</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: 30 mm"
                          value={nuevoRepuesto.diametroEje}
                          onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, diametroEje: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Presión Máxima</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: 16 bar"
                          value={nuevoRepuesto.presionMax}
                          onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, presionMax: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Temperatura</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej: -20°C a +180°C"
                          value={nuevoRepuesto.temperaturaMax}
                          onChange={(e) => setNuevoRepuesto({ ...nuevoRepuesto, temperaturaMax: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary full-width" style={{ padding: '14px' }}>
                      ➕ Cargar Sello al Catálogo Oficial
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
