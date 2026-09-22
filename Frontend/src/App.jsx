import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BuscadorForm from './components/BuscadorForm';
import Footer from './components/Footer';
import { SELLOS_REPUESSTOS, MARCAS_BOMBA, MODELOS_BOMBA, MARCAS_SELLO_COMPETIDOR, TIPOS_FLUIDO, MOCK_LEADS_CONSULTAS } from './data/mockData';
import './styles/design-system.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('acceso');
  const [currentView, setCurrentView] = useState('acceso'); // 'acceso' | 'cliente-auth' | 'empresa-login' | 'home' | 'resultados' | 'detalle' | 'mis-consultas' | 'empresa'
  const [userIdentity, setUserIdentity] = useState(null); // { role: 'public' | 'empresa', name: string }
  const [activeCategory, setActiveCategory] = useState('bombas');
  const [selloSeleccionado, setSelloSeleccionado] = useState(SELLOS_REPUESSTOS[0]);
  
  // Historial de consultas y sellos vistos del cliente
  const [historialConsultasCliente, setHistorialConsultasCliente] = useState([
    {
      id: 'HIST-101',
      fecha: 'Hoy, 14:20',
      codigo: 'GRA-T21-25',
      bomba: 'Grundfos CR 10-02',
      equivalencia: 'John Crane T21',
      estado: 'Cotizado por WhatsApp',
      selloRef: SELLOS_REPUESSTOS[0]
    },
    {
      id: 'HIST-102',
      fecha: 'Ayer, 11:05',
      codigo: 'GRA-MG1-30',
      bomba: 'KSB Etanorm 050-032',
      equivalencia: 'Burgmann MG1',
      estado: 'Ficha Consultada',
      selloRef: SELLOS_REPUESSTOS[1]
    }
  ]);

  // Función centralizada de navegación sincronizada con el historial del navegador (Flechas atrás / adelante)
  const navegarA = (vista, tab = null, pushHistory = true) => {
    const tabDestino = tab || (['home', 'resultados', 'mis-consultas', 'empresa'].includes(vista) ? vista : currentTab);
    setCurrentView(vista);
    setCurrentTab(tabDestino);

    if (pushHistory) {
      window.history.pushState({ vista, tab: tabDestino }, '', `#${vista}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Escuchar flechas atrás / adelante del navegador
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.vista) {
        setCurrentView(event.state.vista);
        setCurrentTab(event.state.tab || 'home');
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setCurrentView(hash);
          if (['home', 'resultados', 'mis-consultas', 'empresa'].includes(hash)) {
            setCurrentTab(hash);
          }
        } else {
          setCurrentView('acceso');
          setCurrentTab('acceso');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Inicializar estado de entrada
    window.history.replaceState({ vista: 'acceso', tab: 'acceso' }, '', '#acceso');

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Estados para autenticación de clientes
  const [clientAuthTab, setClientAuthTab] = useState('login'); // 'login' | 'register'
  const [clientForm, setClientForm] = useState({
    nombre: '',
    email: '',
    pass: '',
    confirmPass: ''
  });

  // Modal interactivo de Login Social (Google / Facebook)
  const [socialModal, setSocialModal] = useState({
    open: false,
    provider: 'Google', // 'Google' | 'Facebook'
    step: 'credentials', // 'credentials' | '2fa' | 'loading'
    email: '',
    pass: ''
  });

  const abrirModalSocial = (provider) => {
    setSocialModal({
      open: true,
      provider: provider,
      step: 'credentials',
      email: '',
      pass: ''
    });
  };

  const handleSocialSubmit = (e) => {
    e.preventDefault();
    if (!socialModal.email || !socialModal.pass) {
      alert("Por favor completá tu correo y contraseña.");
      return;
    }
    // Pasar al paso de verificación / 2FA
    setSocialModal(prev => ({ ...prev, step: 'loading' }));
    setTimeout(() => {
      setSocialModal(prev => ({ ...prev, step: '2fa' }));
    }, 800);
  };

  const handleConfirmar2FA = () => {
    const displayNombre = socialModal.email.split('@')[0] || (socialModal.provider === 'Google' ? 'Usuario Gmail' : 'Usuario Facebook');
    setUserIdentity({ role: 'public', name: displayNombre });
    setSocialModal({ open: false, provider: 'Google', step: 'credentials', email: '', pass: '' });
    navegarA('home', 'home');
  };


  // Estado para el panel de empresa
  const [isEmpresaLoggedIn, setIsEmpresaLoggedIn] = useState(false);
  const [empresaEmail, setEmpresaEmail] = useState('');
  const [empresaPass, setEmpresaPass] = useState('');
  const [empresaSubTab, setEmpresaSubTab] = useState('leads'); // 'leads' | 'carga' | 'calibre'
  const [leadsList, setLeadsList] = useState(MOCK_LEADS_CONSULTAS);
  const [catalogoLocal, setCatalogoLocal] = useState(SELLOS_REPUESSTOS);

  const handleClienteAuthSubmit = (e) => {
    e.preventDefault();
    if (clientAuthTab === 'login') {
      if (!clientForm.email || !clientForm.pass) {
        alert("Por favor ingrese su correo y contraseña.");
        return;
      }
      setUserIdentity({ role: 'public', name: clientForm.email.split('@')[0] });
    } else {
      if (!clientForm.nombre || !clientForm.email || !clientForm.pass) {
        alert("Por favor complete todos los campos para crear su cuenta.");
        return;
      }
      if (clientForm.pass !== clientForm.confirmPass) {
        alert("Las contraseñas no coinciden. Por favor verifique.");
        return;
      }
      alert(`¡Cuenta creada con éxito para ${clientForm.nombre}! Bienvenido a Graphite.`);
      setUserIdentity({ role: 'public', name: clientForm.nombre });
    }
    navegarA('home', 'home');
  };

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
    diametro: '',
    diametroExt: '',
    longitud: ''
  });

  const [resultados, setResultados] = useState(catalogoLocal);

  // Estados del Comparador Directo de Sellos
  const [sellosAComparar, setSellosAComparar] = useState([]);
  const [modalComparadorAbierto, setModalComparadorAbierto] = useState(false);

  const toggleCompararSello = (sello) => {
    setSellosAComparar(prev => {
      const existe = prev.some(s => s.id === sello.id);
      if (existe) {
        return prev.filter(s => s.id !== sello.id);
      } else {
        if (prev.length >= 3) {
          alert("Podés comparar un máximo de 3 sellos mecánicos simultáneamente.");
          return prev;
        }
        return [...prev, sello];
      }
    });
  };

  const handleSearch = () => {
    let filtrados = catalogoLocal;

    if (activeCategory === 'bombas') {
      if (searchParams.marcaBomba) {
        filtrados = filtrados.filter(s => s.marcaBombaCompatible.toLowerCase() === searchParams.marcaBomba.toLowerCase());
      }
      if (searchParams.modeloBomba) {
        filtrados = filtrados.filter(s => s.modeloBombaCompatible.toLowerCase().includes(searchParams.modeloBomba.toLowerCase()));
      }
    } else if (activeCategory === 'sellos') {
      if (searchParams.marcaSello) {
        filtrados = filtrados.filter(s => s.marcaSelloCompetidor.toLowerCase() === searchParams.marcaSello.toLowerCase());
      }
      if (searchParams.tipoSello) {
        filtrados = filtrados.filter(s => 
          s.tipoSelloCompetidor.toLowerCase().includes(searchParams.tipoSello.toLowerCase()) ||
          s.equivalenteCompetidor.toLowerCase().includes(searchParams.tipoSello.toLowerCase())
        );
      }
    } else if (activeCategory === 'medidas') {
      // Búsqueda por calibre: d1 (eje), d3 (exterior), L3 (longitud)
      if (searchParams.diametro) {
        const d1 = parseFloat(searchParams.diametro);
        filtrados = filtrados.filter(s => s.diametroEjeNum === d1 || s.diametroEje.includes(searchParams.diametro));
      }
      if (searchParams.diametroExt) {
        const d3 = parseFloat(searchParams.diametroExt);
        filtrados = filtrados.filter(s => s.diametroExtNum === d3);
      }
      if (searchParams.longitud) {
        const l3 = parseFloat(searchParams.longitud);
        filtrados = filtrados.filter(s => s.longitudNum === l3);
      }
    }

    if (searchParams.fluido) {
      filtrados = filtrados.filter(s => (s.fluidosAptos || []).some(f => f.toLowerCase().includes(searchParams.fluido.toLowerCase())));
    }

    setResultados(filtrados);
    navegarA('resultados', 'resultados');
  };

  const handleReset = () => {
    setSearchParams({
      marcaBomba: '',
      modeloBomba: '',
      marcaSello: '',
      tipoSello: '',
      fluido: '',
      diametro: '',
      diametroExt: '',
      longitud: ''
    });
    setResultados(catalogoLocal);
  };


  const registrarEnHistorial = (sello, estado = 'Ficha Consultada') => {
    setHistorialConsultasCliente(prev => {
      const yaExiste = prev.find(h => h.codigo === sello.codigoEquivalente && h.bomba.includes(sello.marcaBombaCompatible));
      if (yaExiste) return prev;
      return [
        {
          id: `HIST-${Math.floor(Math.random() * 900 + 100)}`,
          fecha: 'Reciente',
          codigo: sello.codigoEquivalente,
          bomba: `${sello.marcaBombaCompatible} ${sello.modeloBombaCompatible}`,
          equivalencia: sello.equivalenteCompetidor,
          estado: estado,
          selloRef: sello
        },
        ...prev
      ];
    });
  };

  const handleVerDetalle = (sello) => {
    setSelloSeleccionado(sello);
    registrarEnHistorial(sello, 'Ficha Consultada');
    navegarA('detalle', 'resultados');
  };

  const handleWhatsApp = (sello) => {
    registrarEnHistorial(sello, 'Cotizado por WhatsApp');
    const msg = `Hola, estoy usando el buscador web y me gustaría recibir asesoramiento y cotización para el sello mecánico compatible con mi bomba (${sello.codigoEquivalente} para ${sello.marcaBombaCompatible} ${sello.modeloBombaCompatible}).`;
    window.open(`https://wa.me/5491138134174?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleImprimirFichaPDF = () => {
    window.print();
  };

  const handleLoginEmpresa = (e) => {
    e.preventDefault();
    if (!empresaEmail || (!empresaEmail.endsWith('@graphite.com.ar') && !empresaEmail.endsWith('@graphite.com'))) {
      alert("Acceso denegado: Debe ingresar un correo institucional válido con dominio @graphite.com.ar");
      return;
    }
    if (!empresaPass || empresaPass.trim().length < 4) {
      alert("Por favor ingrese su contraseña corporativa de acceso.");
      return;
    }
    setIsEmpresaLoggedIn(true);
    setUserIdentity({ role: 'empresa', name: empresaEmail.split('@')[0] });
    navegarA('empresa', 'empresa');
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
          navegarA(tab, tab);
        }}
        userIdentity={userIdentity}
        onChangeAccess={() => {
          setUserIdentity(null);
          setIsEmpresaLoggedIn(false);
          navegarA('acceso', 'acceso');
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
                  navegarA('cliente-auth');
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>👤</div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Acceso Público</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  Para clientes y compradores. Inicie sesión o cree su cuenta para consultar y cotizar.
                </p>
                <button className="btn btn-primary full-width" style={{ marginTop: 'auto' }}>
                  Ingresar como Cliente
                </button>
              </div>

              <div 
                className="card-product" 
                style={{ padding: '40px 24px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid var(--color-primary)' }}
                onClick={() => {
                  navegarA('empresa-login');
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

      {/* VISTA DEDICADA: AUTENTICACIÓN CLIENTES (INICIAR SESIÓN / CREAR CUENTA) */}
      {currentView === 'cliente-auth' && (
        <div className="results-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
          <div style={{ maxWidth: '460px', width: '100%', backgroundColor: 'white', padding: '36px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
            <span className="back-link" style={{ marginBottom: '16px', display: 'inline-block' }} onClick={() => navegarA('acceso', 'acceso')}>
              ← Volver a selección de portal
            </span>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px' }}>👤</span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>Portal Clientes Graphite</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Acceda a compatibilidades verificadas, fichas técnicas y cotizaciones</p>
            </div>

            <div className="search-tabs" style={{ marginBottom: '20px' }}>
              <button 
                type="button"
                className={`tab-btn ${clientAuthTab === 'login' ? 'active' : ''}`}
                onClick={() => setClientAuthTab('login')}
              >
                Iniciar Sesión
              </button>
              <button 
                type="button"
                className={`tab-btn ${clientAuthTab === 'register' ? 'active' : ''}`}
                onClick={() => setClientAuthTab('register')}
              >
                Crear Cuenta
              </button>
            </div>

            <form onSubmit={handleClienteAuthSubmit}>
              {clientAuthTab === 'register' && (
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Nombre Completo o Empresa *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej: Juan Pérez / Metalúrgica Sur"
                    value={clientForm.nombre}
                    onChange={(e) => setClientForm({ ...clientForm, nombre: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Correo Electrónico *</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="tu.mail@empresa.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Contraseña *</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={clientForm.pass}
                  onChange={(e) => setClientForm({ ...clientForm, pass: e.target.value })}
                />
              </div>

              {clientAuthTab === 'register' && (
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Confirmar Contraseña *</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={clientForm.confirmPass}
                    onChange={(e) => setClientForm({ ...clientForm, confirmPass: e.target.value })}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary full-width" style={{ padding: '14px', marginBottom: '16px' }}>
                {clientAuthTab === 'login' ? '🔑 Iniciar Sesión' : '✨ Crear Cuenta e Ingresar'}
              </button>
            </form>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                type="button"
                className="btn btn-google full-width" 
                style={{ padding: '10px', fontSize: '13px' }}
                onClick={() => abrirModalSocial('Google')}
              >
                <span>🔴</span> Continuar con Google (Gmail)
              </button>
              <button 
                type="button"
                className="btn btn-facebook full-width" 
                style={{ padding: '10px', fontSize: '13px' }}
                onClick={() => abrirModalSocial('Facebook')}
              >
                <span>🔵</span> Continuar con Facebook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INTERACTIVO DE AUTENTICACIÓN SOCIAL (GOOGLE / FACEBOOK) */}
      {socialModal.open && (
        <div className="social-modal-backdrop" onClick={() => setSocialModal({ ...socialModal, open: false })}>
          <div className="social-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="social-modal-header" style={{ borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="oauth-provider-badge">
                  {socialModal.provider === 'Google' ? (
                    <>
                      <span style={{ fontSize: '20px' }}>🔴</span>
                      <span style={{ color: '#1E293B', fontWeight: 800 }}>Acceder con Google</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '20px' }}>🔵</span>
                      <span style={{ color: '#1877F2', fontWeight: 800 }}>Iniciar sesión con Facebook</span>
                    </>
                  )}
                </div>
                <button 
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94A3B8' }}
                  onClick={() => setSocialModal({ ...socialModal, open: false })}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', textAlign: 'left', marginTop: '4px' }}>
                Conectar tu cuenta para acceder a la plataforma de Graphite Technologies.
              </p>
            </div>

            <div className="social-modal-body" style={{ paddingTop: '20px' }}>
              {socialModal.step === 'credentials' && (
                <form onSubmit={handleSocialSubmit}>
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontSize: '13px' }}>
                      {socialModal.provider === 'Google' ? 'Correo electrónico o Gmail' : 'Correo electrónico o número de teléfono'}
                    </label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder={socialModal.provider === 'Google' ? "ejemplo@gmail.com" : "usuario@email.com"}
                      required
                      value={socialModal.email}
                      onChange={(e) => setSocialModal({ ...socialModal, email: e.target.value })}
                      autoFocus
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ fontSize: '13px' }}>Contraseña de {socialModal.provider}</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="••••••••" 
                      required
                      value={socialModal.pass}
                      onChange={(e) => setSocialModal({ ...socialModal, pass: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                      onClick={() => setSocialModal({ ...socialModal, open: false })}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ padding: '8px 20px', fontSize: '13px', backgroundColor: socialModal.provider === 'Facebook' ? '#1877F2' : 'var(--color-primary)' }}
                    >
                      Siguiente →
                    </button>
                  </div>
                </form>
              )}

              {socialModal.step === 'loading' && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1s infinite linear' }}>⏳</div>
                  <p style={{ fontSize: '14px', fontWeight: 700 }}>Conectando con servidores de {socialModal.provider}...</p>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Estableciendo conexión segura cifrada TLS.</p>
                </div>
              )}

              {socialModal.step === '2fa' && (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <span style={{ fontSize: '28px' }}>📲</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    {socialModal.provider === 'Google' ? '¿Sos vos el que intenta acceder?' : 'Confirmación de inicio de sesión'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                    {socialModal.provider === 'Google' ? (
                      <>Google envió una notificación a tu teléfono vinculado para confirmar que <strong>{socialModal.email}</strong> es quien ingresa a Graphite Technologies.</>
                    ) : (
                      <>Facebook envió una alerta de seguridad con código de verificación para autorizar a <strong>{socialModal.email}</strong>.</>
                    )}
                  </p>

                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#334155' }}>
                    🔔 <strong>Aprobá el cartel de seguridad en tu dispositivo móvil o tocá confirmar abajo:</strong>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary full-width" 
                    style={{ padding: '12px', fontSize: '14px', backgroundColor: '#10B981' }}
                    onClick={handleConfirmar2FA}
                  >
                    ✓ Sí, soy yo (Confirmar e Ingresar)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISTA DEDICADA: LOGIN INSTITUCIONAL EMPRESA */}
      {currentView === 'empresa-login' && (
        <div className="results-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', padding: '40px 20px' }}>
          <div style={{ maxWidth: '440px', width: '100%', backgroundColor: 'white', padding: '36px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
            <span className="back-link" style={{ marginBottom: '16px', display: 'inline-block' }} onClick={() => navegarA('acceso', 'acceso')}>
              ← Volver a selección de portal
            </span>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px' }}>🔒</span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px' }}>Acceso Empresa Graphite</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Módulo exclusivo para personal institucional @graphite.com.ar</p>
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
          </div>
        </div>
      )}

      {currentView === 'home' && (
        <section className="hero">
          <div className="hero-bg-motion"></div>
          <div className="container hero-container">
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
            <span className="back-link" onClick={() => { setCurrentView('home'); setCurrentTab('home'); }}>
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
                  {resultados.map((sello) => {
                    const isSelected = sellosAComparar.some(s => s.id === sello.id);
                    return (
                      <div key={sello.id} className="card-product" onClick={() => handleVerDetalle(sello)}>
                        <div className="card-image-box">
                          <div className="badge-verified">✓ Matcheo 100%</div>
                          <img src={sello.imagen} alt={sello.codigoEquivalente} className="card-seal-img" />
                        </div>

                        <div className="card-body">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div className="card-code">{sello.id}</div>
                            <button 
                              className={`btn-compare-check ${isSelected ? 'selected' : ''}`}
                              onClick={(e) => { e.stopPropagation(); toggleCompararSello(sello); }}
                              title="Seleccionar para comparar lado a lado"
                            >
                              <span>{isSelected ? '☑️' : '◻️'}</span> Comparar
                            </button>
                          </div>
                          <h3 className="card-title">{sello.codigoEquivalente}</h3>
                          
                          <div className="card-spec">
                            <div className="spec-item"><span className="spec-label">Equivalencia:</span><span className="spec-val">{sello.equivalenteCompetidor}</span></div>
                            <div className="spec-item"><span className="spec-label">Bomba:</span><span className="spec-val">{sello.marcaBombaCompatible} - {sello.modeloBombaCompatible}</span></div>
                            <div className="spec-item"><span className="spec-label">Eje / D3 / L3:</span><span className="spec-val">{sello.medidasDetalle || sello.diametroEje}</span></div>
                          </div>

                          <div className="card-footer">
                            <button className="btn btn-whatsapp full-width" onClick={(e) => { e.stopPropagation(); handleVerDetalle(sello); }}>
                              🔍 Ver Ficha Técnica Dedicada
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </main>
            </div>
          </div>
        </div>
      )}

      {/* BARRA FLOTANTE STICKY DE COMPARACIÓN DE SELLOS */}
      {sellosAComparar.length > 0 && (
        <div className="comparator-dock">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚖️</span>
            <div>
              <strong style={{ fontSize: '13px', display: 'block' }}>Comparador de Repuestos ({sellosAComparar.length}/3)</strong>
              <div className="comparator-chips" style={{ marginTop: '4px' }}>
                {sellosAComparar.map(s => (
                  <span key={s.id} className="comparator-chip">
                    {s.id} 
                    <span className="comparator-chip-remove" onClick={() => toggleCompararSello(s)}>✕</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '6px 14px', fontSize: '12px', background: '#334155', color: 'white', border: 'none' }}
              onClick={() => setSellosAComparar([])}
            >
              Vaciar
            </button>
            <button 
              className="btn btn-primary" 
              style={{ padding: '8px 18px', fontSize: '13px', backgroundColor: '#38BDF8', color: '#0F172A', fontWeight: 800 }}
              onClick={() => setModalComparadorAbierto(true)}
            >
              Comparar Ahora ({sellosAComparar.length}) →
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE COMPARACIÓN DIRECTA LADO A LADO */}
      {modalComparadorAbierto && (
        <div className="social-modal-backdrop" onClick={() => setModalComparadorAbierto(false)}>
          <div className="comparator-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚖️</span> Comparación Técnica Lado a Lado de Sellos Mecánicos
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Evaluá especificaciones operativas, compatibilidades de bomba y materiales de caras en simultáneo.
                </p>
              </div>
              <button 
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94A3B8' }}
                onClick={() => setModalComparadorAbierto(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px 28px 28px 28px', overflowX: 'auto' }}>
              <table className="comparator-table">
                <thead>
                  <tr>
                    <th className="comparator-feature-lbl">Especificación / Repuesto</th>
                    {sellosAComparar.map(s => (
                      <th key={s.id} style={{ minWidth: '220px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 800 }}>{s.id}</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{s.codigoEquivalente}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="comparator-feature-lbl">🏢 Bomba Compatible</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id}><strong>{s.marcaBombaCompatible}</strong><br />{s.modeloBombaCompatible}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">🔄 Equivalencia de Competidor</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id}>{s.equivalenteCompetidor}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">⚡ Presión Máxima de Trabajo</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id} style={{ fontWeight: 800, color: '#2563EB' }}>{s.presionMax}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">🌡️ Temperatura Operativa</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id} style={{ fontWeight: 800, color: '#D20A11' }}>{s.temperaturaMax}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">🚀 Velocidad Máxima del Eje</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id}>{s.velocidadMax}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">⚙️ Materiales de Caras / Pistas</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id}><strong>{s.carasMaterial || s.materiales}</strong></td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">🛡️ Elastómero / O-Ring</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id}>{s.elastomeroMaterial || "Vitón (FKM)"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">📏 Medidas Calibre (d₁ / d₃ / L₃)</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id}>{s.medidasDetalle || s.diametroEje}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="comparator-feature-lbl">Acción Directa</td>
                    {sellosAComparar.map(s => (
                      <td key={s.id}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <button 
                            className="btn btn-whatsapp" 
                            style={{ padding: '8px 12px', fontSize: '12px' }}
                            onClick={() => { setModalComparadorAbierto(false); handleWhatsApp(s); }}
                          >
                            💬 Cotizar WhatsApp
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '8px 12px', fontSize: '12px' }}
                            onClick={() => { setModalComparadorAbierto(false); handleVerDetalle(s); }}
                          >
                            🔍 Ver Ficha Completa
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {currentView === 'detalle' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => navegarA('resultados', 'resultados')}>
              ← Volver al Catálogo de Resultados
            </span>

            {/* Cabecera institucional visible exclusivamente al imprimir o guardar en PDF */}
            <div className="print-pdf-header" style={{ display: 'none' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>GRAPHITE TECHNOLOGIES ARGENTINA</h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>Ficha Técnica Oficial y Especificaciones de Sello Mecánico</p>
              </div>
              <div className="print-pdf-contact">
                <strong>Contacto Técnico:</strong> info@graphite.com.ar<br />
                <strong>WhatsApp Comercial:</strong> +54 9 11 3813-4174<br />
                <strong>Web Oficial:</strong> graphite.com.ar
              </div>
            </div>

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

                  <div className="spec-detail-box" style={{ gridColumn: '1/-1', backgroundColor: '#F0FDF4', borderLeftColor: '#10B981' }}>
                    <div className="spec-detail-title" style={{ color: '#059669' }}>🧪 Fluidos Aptos Verificados</div>
                    <div className="spec-detail-val" style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', marginTop: '4px' }}>
                      {(selloSeleccionado.fluidosAptos || []).join(' · ')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <button className="btn btn-whatsapp" style={{ padding: '16px', fontSize: '15px' }} onClick={() => handleWhatsApp(selloSeleccionado)}>
                    💬 Cotizar por WhatsApp (11 3813-4174)
                  </button>
                  <button className="btn btn-pdf" style={{ padding: '16px', fontSize: '15px' }} onClick={handleImprimirFichaPDF}>
                    📄 Descargar / Imprimir Ficha PDF
                  </button>
                </div>

              </div>
            </div>

            {/* Pie de página formal exclusivo de la impresión / PDF */}
            <div className="print-footer-validez" style={{ display: 'none' }}>
              Documento emitido por la Plataforma de Selección Técnica de <strong>Graphite Technologies Argentina</strong>. Válido como referencia de ingeniería y cotización oficial. Para asesoramiento directo comunicarse al +54 9 11 3813-4174.
            </div>
          </div>
        </div>
      )}

      {/* VISTA DEDICADA: MIS CONSULTAS GUARDADAS (CLIENTE PÚBLICO) */}
      {currentView === 'mis-consultas' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => navegarA('home', 'home')}>
              ← Volver al Buscador Principal
            </span>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800 }}>📋 Mis Consultas & Repuestos Vistos</h1>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
                    Historial de compatibilidades y cotizaciones solicitadas por <strong>{userIdentity?.name || 'Cliente'}</strong>.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => navegarA('home', 'home')}>
                  🔍 Nueva Búsqueda
                </button>
              </div>

              {historialConsultasCliente.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-text-muted)' }}>
                  <span style={{ fontSize: '48px' }}>📂</span>
                  <p style={{ fontSize: '16px', fontWeight: 700, marginTop: '12px' }}>Aún no tenés consultas guardadas en tu sesión.</p>
                  <p style={{ fontSize: '14px', marginTop: '4px' }}>Realizá búsquedas en el catálogo para ver y cotizar sellos compatibles.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Fecha / ID</th>
                        <th>Sello Mecánico</th>
                        <th>Bomba Compatible</th>
                        <th>Equivalencia</th>
                        <th>Estado</th>
                        <th>Acción Directa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historialConsultasCliente.map(item => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.id}</strong><br />
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.fecha}</span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--color-primary)' }}>{item.codigo}</strong>
                          </td>
                          <td>{item.bomba}</td>
                          <td>{item.equivalencia}</td>
                          <td>
                            <span className="badge-verified" style={{ position: 'static', display: 'inline-block', fontSize: '11px', padding: '4px 8px' }}>
                              ✓ {item.estado}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="btn btn-whatsapp" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => handleWhatsApp(item.selloRef)}
                              >
                                💬 Re-cotizar
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => handleVerDetalle(item.selloRef)}
                              >
                                🔍 Ficha
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentView === 'cuenta' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => navegarA('home', 'home')}>
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
            <span className="back-link" onClick={() => { setCurrentView('home'); setCurrentTab('home'); }}>
              ← Volver al Portal Público
            </span>

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
                    ➕ Carga de Sellos al Catálogo (ABM)
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
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
