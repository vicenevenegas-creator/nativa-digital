import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BuscadorForm from './components/BuscadorForm';
import Footer from './components/Footer';
import { supabase, AUTH_CALLBACK_URL } from './supabase';
import { SELLOS_REPUESSTOS, MARCAS_BOMBA, MODELOS_BOMBA, MARCAS_SELLO_COMPETIDOR, TIPOS_FLUIDO, MOCK_LEADS_CONSULTAS } from './data/mockData';
import './styles/design-system.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('acceso');
  const [currentView, setCurrentView] = useState('acceso'); // 'acceso' | 'cliente-auth' | 'empresa-login' | 'home' | 'resultados' | 'detalle' | 'mis-consultas' | 'empresa'
  const [userIdentity, setUserIdentity] = useState(null); // { role: 'public' | 'empresa', name: string }
  const [activeCategory, setActiveCategory] = useState('bombas');
  const [selloSeleccionado, setSelloSeleccionado] = useState(SELLOS_REPUESSTOS[0]);
  
  // Favoritos del cliente
  const [favoritos, setFavoritos] = useState(() => {
    try {
      const saved = localStorage.getItem('graphite_favoritos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorito = (sello, e = null) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFavoritos(prev => {
      const exists = prev.some(f => f.id === sello.id);
      let updated;
      if (exists) {
        updated = prev.filter(f => f.id !== sello.id);
      } else {
        updated = [...prev, sello];
      }
      try {
        localStorage.setItem('graphite_favoritos', JSON.stringify(updated));
      } catch (err) {
        console.error("Error guardando favoritos", err);
      }
      return updated;
    });
  };

  // Historial de consultas enviadas a WhatsApp del cliente (solo cotizaciones)
  const [historialConsultasCliente, setHistorialConsultasCliente] = useState(() => {
    try {
      const saved = localStorage.getItem('graphite_cotizaciones');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Función centralizada de navegación sincronizada con el historial del navegador (Flechas atrás / adelante)
  const navegarA = (vista, tab = null, pushHistory = true) => {
    const tabDestino = tab || (['home', 'resultados', 'favoritos', 'mis-consultas', 'empresa'].includes(vista) ? vista : currentTab);
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
          if (['home', 'resultados', 'favoritos', 'mis-consultas', 'empresa'].includes(hash)) {
            setCurrentTab(hash);
          }
        } else {
          setCurrentView('acceso');
          setCurrentTab('acceso');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Inicializar estado de entrada (salvo al volver de Supabase: ese caso lo resuelve el callback)
    if (window.location.pathname !== '/auth/callback') {
      window.history.replaceState({ vista: 'acceso', tab: 'acceso' }, '', '#acceso');
    }

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

  // Autenticación con Google vía Supabase
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: AUTH_CALLBACK_URL
        }
      });
      if (error) {
        console.error("Error al iniciar sesión con Google:", error.message);
        alert("Error al iniciar sesión con Google: " + error.message);
      }
    } catch (err) {
      console.error("Error inesperado en Google Auth:", err);
      alert("Error al conectar con el servicio de autenticación.");
    }
  };

  // Autenticación Corporativa con Outlook / Microsoft 365 (exclusivo personal Graphite)
  const handleOutlookLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: AUTH_CALLBACK_URL,
          scopes: 'email profile openid'
        }
      });
      if (error) {
        console.error("Error al conectar con Outlook / Microsoft:", error.message);
        alert("Para habilitar el ingreso oficial con Outlook corporativo, asegurate de activar el proveedor Azure en tu panel de Supabase.");
      }
    } catch (err) {
      console.error("Error inesperado en Outlook Auth:", err);
      alert("Error al conectar con el servicio de autenticación corporativa.");
    }
  };

  const resolverRolYRedirigir = (email, nombreCustom = null) => {
    const emailNorm = (email || '').trim().toLowerCase();
    
    // 1. Administrador General (martin.hellwing@graphite.com)
    if (emailNorm.startsWith('martin.hellwing@graphite.com')) {
      const identity = { role: 'admin', name: nombreCustom || 'Martín Hellwing', email: emailNorm };
      setUserIdentity(identity);
      setIsEmpresaLoggedIn(true);
      navegarA('empresa', 'empresa');
      return;
    }
    
    // 2. Vendedor / Cotizador (@graphite.com o @graphite.com.ar)
    if (emailNorm.endsWith('@graphite.com') || emailNorm.endsWith('@graphite.com.ar')) {
      const display = nombreCustom || emailNorm.split('@')[0];
      const identity = { role: 'vendedor', name: display, email: emailNorm };
      setUserIdentity(identity);
      setIsEmpresaLoggedIn(true);
      navegarA('empresa', 'empresa');
      return;
    }
    
    // 3. Cliente / Comprador (cualquier otro correo)
    const displayName = nombreCustom || emailNorm.split('@')[0] || 'Cliente';
    const identity = { role: 'cliente', name: displayName, email: emailNorm };
    setUserIdentity(identity);
    setIsEmpresaLoggedIn(false);
    navegarA('home', 'home');
  };

  // Escuchar sesión activa de Supabase (ej: login con Google o Microsoft Outlook)
  useEffect(() => {
    const guardarEnCacheSiEsNuevo = (userEmail, userName) => {
      if (!userEmail) return;
      try {
        const guardados = JSON.parse(localStorage.getItem('graphite_usuarios_registrados') || '[]');
        if (!guardados.some(u => u.email.toLowerCase() === userEmail.toLowerCase())) {
          guardados.push({
            email: userEmail.toLowerCase(),
            nombre: userName,
            fechaRegistro: new Date().toISOString()
          });
          localStorage.setItem('graphite_usuarios_registrados', JSON.stringify(guardados));
        }
      } catch (e) {
        console.error("Error guardando usuario en cache", e);
      }
    };

    // Callback de Supabase (/auth/callback?code=...&next=home): intercambiar el código por la sesión.
    // La URL se limpia antes del intercambio para que el código (de un solo uso) no quede en el historial.
    const procesarCallbackAuth = async () => {
      if (window.location.pathname !== '/auth/callback') return;

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorDescripcion = params.get('error_description');
      const destino = params.get('next') || 'home';

      window.history.replaceState({ vista: destino, tab: destino }, '', `/#${destino}`);

      if (errorDescripcion || !code) {
        window.history.replaceState({ vista: 'acceso', tab: 'acceso' }, '', '/#acceso');
        if (errorDescripcion) alert("No se pudo completar el inicio de sesión: " + errorDescripcion);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Error al procesar el callback de Supabase:", error.message);
        window.history.replaceState({ vista: 'acceso', tab: 'acceso' }, '', '/#acceso');
        alert("No se pudo completar el inicio de sesión. Por favor ingresá con tu correo y contraseña.");
      }
      // Si salió bien, onAuthStateChange recibe la sesión y resolverRolYRedirigir lleva a #home.
    };

    procesarCallbackAuth().then(() => supabase.auth.getSession()).then(({ data: { session } }) => {
      if (session?.user) {
        const userEmail = session.user.email;
        const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0];
        guardarEnCacheSiEsNuevo(userEmail, userName);
        resolverRolYRedirigir(userEmail, userName);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userEmail = session.user.email;
        const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0];
        guardarEnCacheSiEsNuevo(userEmail, userName);
        resolverRolYRedirigir(userEmail, userName);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  // Estado para el panel de empresa
  const [isEmpresaLoggedIn, setIsEmpresaLoggedIn] = useState(false);
  const [empresaEmail, setEmpresaEmail] = useState('');
  const [empresaPass, setEmpresaPass] = useState('');
  const [empresaSubTab, setEmpresaSubTab] = useState('leads'); // 'leads' | 'carga' | 'metricas'
  const [leadsList, setLeadsList] = useState(MOCK_LEADS_CONSULTAS);
  const [catalogoLocal, setCatalogoLocal] = useState(SELLOS_REPUESSTOS);

  const handleUnifiedAuthSubmit = async (e) => {
    e.preventDefault();
    const emailNorm = (clientForm.email || '').trim().toLowerCase();

    if (clientAuthTab === 'login') {
      if (!emailNorm || !clientForm.pass) {
        alert("Por favor ingrese su correo y contraseña.");
        return;
      }

      // Intentar login con Supabase Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailNorm,
          password: clientForm.pass
        });

        if (error) {
          console.warn("Aviso en login con Supabase:", error.message);
          const usuariosGuardados = JSON.parse(localStorage.getItem('graphite_usuarios_registrados') || '[]');
          const usuarioExistente = usuariosGuardados.find(u => u.email.toLowerCase() === emailNorm);

          if (!usuarioExistente && (error.message.includes('Invalid login credentials') || error.message.includes('not found'))) {
            alert(`⚠️ El correo "${emailNorm}" no se encuentra registrado.\n\nPor favor hacé clic en la pestaña "Crear Cuenta" para registrarte.`);
            return;
          }
        }

        const nombreUsuario = data?.user?.user_metadata?.full_name || clientForm.nombre || emailNorm.split('@')[0];
        resolverRolYRedirigir(emailNorm, nombreUsuario);
      } catch (err) {
        console.error("Error en proceso de login:", err);
        resolverRolYRedirigir(emailNorm);
      }
    } else {
      // Pestaña: Crear Cuenta
      if (!clientForm.nombre.trim() || !emailNorm || !clientForm.pass) {
        alert("Por favor complete todos los campos para crear su cuenta.");
        return;
      }

      // 1. Bloqueo de creación pública para dominios corporativos internos
      if (emailNorm.endsWith('@graphite.com.ar') || emailNorm.endsWith('@graphite.com')) {
        alert("🔒 Los correos corporativos @graphite.com.ar corresponden a colaboradores de la empresa.\n\nDeben ingresar utilizando el botón de 'Acceso Corporativo con Outlook / Microsoft 365' o iniciar sesión con sus credenciales autorizadas.");
        return;
      }

      if (clientForm.pass !== clientForm.confirmPass) {
        alert("Las contraseñas no coinciden. Por favor verifique.");
        return;
      }

      // 2. Comprobar si el correo ya está registrado (en localStorage o Supabase)
      const usuariosGuardados = JSON.parse(localStorage.getItem('graphite_usuarios_registrados') || '[]');
      const yaRegistrado = usuariosGuardados.some(u => u.email.toLowerCase() === emailNorm);

      if (yaRegistrado) {
        alert(`⚠️ El correo "${emailNorm}" YA se encuentra registrado en Graphite Technologies.\n\nPor favor, ingresá en la pestaña "Iniciar Sesión" con tu contraseña o mediante Google.`);
        setClientAuthTab('login');
        return;
      }

      // 3. Registrar en Supabase Auth (dispara el correo de confirmación/bienvenida a la casilla)
      try {
        const { data, error } = await supabase.auth.signUp({
          email: emailNorm,
          password: clientForm.pass,
          options: {
            data: {
              full_name: clientForm.nombre.trim()
            },
            emailRedirectTo: AUTH_CALLBACK_URL
          }
        });

        if (error) {
          if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
            alert(`⚠️ El correo "${emailNorm}" ya está registrado en Graphite Technologies. Por favor iniciá sesión.`);
            setClientAuthTab('login');
            return;
          }
          console.warn("Aviso en Supabase signUp:", error.message);
        }

        // 4. Guardar en almacenamiento de cuentas registradas
        const nuevoRegistro = {
          email: emailNorm,
          nombre: clientForm.nombre.trim(),
          fechaRegistro: new Date().toISOString()
        };
        localStorage.setItem('graphite_usuarios_registrados', JSON.stringify([...usuariosGuardados, nuevoRegistro]));

        alert(`✅ ¡Cuenta creada con éxito para ${clientForm.nombre}!\n\nSe ha enviado un aviso de confirmación y bienvenida a tu casilla (${emailNorm}). ¡Bienvenido a Graphite Technologies!`);
        resolverRolYRedirigir(emailNorm, clientForm.nombre.trim());
      } catch (err) {
        console.error("Error en registro:", err);
        alert(`⚠️ Ocurrió un error al procesar el registro: ${err.message}`);
      }
    }
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


  const registrarEnHistorial = (sello, estado = 'Cotizado por WhatsApp') => {
    const ahora = new Date();
    const fechaTexto = `${ahora.toLocaleDateString('es-AR')}, ${ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
    setHistorialConsultasCliente(prev => {
      const nuevoItem = {
        id: `COT-${Math.floor(Math.random() * 9000 + 1000)}`,
        fecha: fechaTexto,
        codigo: sello.codigoEquivalente,
        bomba: `${sello.marcaBombaCompatible} ${sello.modeloBombaCompatible}`,
        equivalencia: sello.equivalenteCompetidor,
        estado: estado,
        selloRef: sello
      };
      const actualizados = [nuevoItem, ...prev.filter(h => h.codigo !== sello.codigoEquivalente)];
      try {
        localStorage.setItem('graphite_cotizaciones', JSON.stringify(actualizados));
      } catch (err) {
        console.error("Error guardando cotizaciones en localStorage", err);
      }
      return actualizados;
    });
  };

  const handleVerDetalle = (sello) => {
    setSelloSeleccionado(sello);
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
        currentView={currentView}
        favoritosCount={favoritos.length}
        onChangeAccess={() => {
          supabase.auth.signOut().catch(() => {});
          setUserIdentity(null);
          setIsEmpresaLoggedIn(false);
          navegarA('acceso', 'acceso');
        }}
      />

      {(currentView === 'acceso' || currentView === 'cliente-auth' || currentView === 'empresa-login') && (
        <div className="auth-page-wrapper">
          <div className="auth-bg-motion"></div>
          <div className="auth-card-container">
            <div style={{ backgroundColor: 'white', padding: '36px', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <img 
                  src="https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png" 
                  alt="Graphite Logo" 
                  style={{ width: '52px', height: '52px', marginBottom: '8px' }} 
                />
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', margin: '4px 0' }}>
                  GRAPHITE TECHNOLOGIES
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  Ingreso Unificado · Detección Inteligente de Perfil
                </p>
              </div>

              {/* Tabs Iniciar Sesión / Crear Cuenta */}
              <div className="search-tabs" style={{ marginBottom: '18px' }}>
                <button 
                  type="button" 
                  className={`tab-btn ${clientAuthTab === 'login' ? 'active' : ''}`}
                  onClick={() => setClientAuthTab('login')}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Iniciar Sesión
                </button>
                <button 
                  type="button" 
                  className={`tab-btn ${clientAuthTab === 'register' ? 'active' : ''}`}
                  onClick={() => setClientAuthTab('register')}
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  Crear Cuenta
                </button>
              </div>

              <form onSubmit={handleUnifiedAuthSubmit}>
                {clientAuthTab === 'register' && (
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">Nombre Completo o Razón Social *</label>
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
                    placeholder="martin.hellwing@graphite.com / cotizador@... / cliente@..."
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    required
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    El sistema detectará si sos Cliente, Vendedor (@graphite.com) o Administrador.
                  </span>
                </div>

                <div className="form-group" style={{ marginBottom: clientAuthTab === 'register' ? '14px' : '20px' }}>
                  <label className="form-label">Contraseña *</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={clientForm.pass}
                    onChange={(e) => setClientForm({ ...clientForm, pass: e.target.value })}
                    required
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
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary full-width" style={{ padding: '14px' }}>
                  {clientAuthTab === 'login' ? '🔑 Iniciar Sesión' : '✨ Crear Cuenta e Ingresar'}
                </button>
              </form>

              {/* Opción de Google / Gmail abajo del formulario */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 14px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  o continuar con
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
              </div>

              <button 
                type="button" 
                className="btn btn-google full-width" 
                style={{ padding: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}
                onClick={handleGoogleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continuar con Google (Gmail)
              </button>

              {/* Botón de Acceso Corporativo con Outlook / Microsoft 365 para personal @graphite.com.ar */}
              <button 
                type="button" 
                className="btn btn-secondary full-width" 
                style={{ 
                  padding: '12px', 
                  fontSize: '13.5px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '10px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: '1px solid #1E293B',
                  fontWeight: 600
                }}
                onClick={handleOutlookLogin}
                title="Acceso exclusivo para colaboradores con cuenta @graphite.com.ar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                  <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                💼 Ingreso Corporativo (Outlook / Microsoft 365)
              </button>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 12px', marginTop: '14px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#475569', display: 'block', lineHeight: 1.4 }}>
                  🏢 <strong>Personal de Graphite:</strong> Utilizá el botón de Outlook / Microsoft 365 para validar tu identidad corporativa.
                </span>
              </div>
            </div>
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
                    const isFav = favoritos.some(f => f.id === sello.id);
                    return (
                      <div key={sello.id} className="card-product" onClick={() => handleVerDetalle(sello)}>
                        <div className="card-image-box" style={{ position: 'relative' }}>
                          <div className="badge-verified">✓ Matcheo 100%</div>
                          <button 
                            type="button"
                            className="btn-fav-toggle"
                            onClick={(e) => toggleFavorito(sello, e)}
                            title={isFav ? "Quitar de Favoritos" : "Marcar como Favorito"}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: isFav ? '#FEF2F2' : 'rgba(255, 255, 255, 0.92)',
                              border: isFav ? '1px solid #F87171' : '1px solid #CBD5E1',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '15px',
                              zIndex: 10,
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            {isFav ? '❤️' : '🤍'}
                          </button>
                          <img src={sello.imagen} alt={sello.codigoEquivalente} className="card-seal-img" />
                        </div>

                        <div className="card-body">
                          <div style={{ marginBottom: '4px' }}>
                            <div className="card-code">{sello.id}</div>
                          </div>
                          <h3 className="card-title">{sello.codigoEquivalente}</h3>
                          
                          <div className="card-spec">
                            <div className="spec-item"><span className="spec-label">Equivalencia:</span><span className="spec-val">{sello.equivalenteCompetidor}</span></div>
                            <div className="spec-item"><span className="spec-label">Bomba:</span><span className="spec-val">{sello.marcaBombaCompatible} - {sello.modeloBombaCompatible}</span></div>
                            <div className="spec-item"><span className="spec-label">Medidas:</span><span className="spec-val">{sello.medidasDetalle || sello.diametroEje}</span></div>
                          </div>

                          <div className="card-footer" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                            <button className="btn btn-whatsapp full-width" onClick={(e) => { e.stopPropagation(); handleVerDetalle(sello); }}>
                              🔍 Ver Ficha Técnica
                            </button>
                            <button 
                              type="button"
                              className="btn btn-secondary" 
                              onClick={(e) => toggleFavorito(sello, e)}
                              title={isFav ? "Quitar de Favoritos" : "Guardar en Favoritos"}
                              style={{ 
                                padding: '8px 12px',
                                backgroundColor: isFav ? '#FEF2F2' : 'var(--color-bg-light)',
                                borderColor: isFav ? '#FCA5A5' : 'var(--color-border)'
                              }}
                            >
                              {isFav ? '⭐' : '☆'}
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
                    <td className="comparator-feature-lbl">📏 Medidas Calibre (Eje / Ext / Altura)</td>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
                  <button className="btn btn-whatsapp" style={{ padding: '15px 12px', fontSize: '14px' }} onClick={() => handleWhatsApp(selloSeleccionado)}>
                    💬 Cotizar por WhatsApp
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary" 
                    style={{ 
                      padding: '15px 12px', 
                      fontSize: '14px', 
                      backgroundColor: favoritos.some(f => f.id === selloSeleccionado.id) ? '#FEF2F2' : 'var(--color-bg-light)',
                      borderColor: favoritos.some(f => f.id === selloSeleccionado.id) ? '#F87171' : 'var(--color-border)',
                      color: favoritos.some(f => f.id === selloSeleccionado.id) ? '#B91C1C' : 'var(--color-text-main)',
                      fontWeight: 700 
                    }} 
                    onClick={() => toggleFavorito(selloSeleccionado)}
                  >
                    {favoritos.some(f => f.id === selloSeleccionado.id) ? '❤️ En Favoritos' : '⭐ Marcar como Favorito'}
                  </button>
                  <button className="btn btn-pdf" style={{ padding: '15px 12px', fontSize: '14px' }} onClick={handleImprimirFichaPDF}>
                    📄 Imprimir Ficha PDF
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

      {/* VISTA DEDICADA: MIS SELLOS FAVORITOS (CLIENTE) */}
      {currentView === 'favoritos' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => navegarA('home', 'home')}>
              ← Volver al Buscador Principal
            </span>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>⭐ Mis Sellos Favoritos ({favoritos.length})</h1>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
                    Repuestos que marcaste como favoritos para comparar, revisar o cotizar luego.
                  </p>
                </div>
                {favoritos.length > 0 && (
                  <button 
                    type="button"
                    className="btn btn-secondary" 
                    style={{ fontSize: '12.5px', padding: '8px 14px', color: '#B91C1C', borderColor: '#FCA5A5' }}
                    onClick={() => {
                      if (window.confirm("¿Deseas vaciar tu lista de favoritos?")) {
                        setFavoritos([]);
                        localStorage.removeItem('graphite_favoritos');
                      }
                    }}
                  >
                    🗑️ Vaciar Favoritos
                  </button>
                )}
              </div>

              {favoritos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: 'var(--color-bg-light)', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
                  <span style={{ fontSize: '44px' }}>⭐</span>
                  <p style={{ fontSize: '16px', fontWeight: 700, marginTop: '12px', color: 'var(--color-text-main)' }}>
                    No tenés sellos guardados en favoritos
                  </p>
                  <p style={{ fontSize: '14px', marginTop: '4px', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '4px auto 16px auto' }}>
                    Marcá con la estrella o el corazón cualquier repuesto del catálogo o del buscador para tenerlo a mano acá.
                  </p>
                  <button className="btn btn-primary" onClick={() => navegarA('resultados', 'resultados')}>
                    🔍 Explorar Catálogo de Sellos
                  </button>
                </div>
              ) : (
                <div className="results-grid">
                  {favoritos.map((sello) => (
                    <div key={sello.id} className="card-product" onClick={() => handleVerDetalle(sello)}>
                      <div className="card-image-box" style={{ position: 'relative' }}>
                        <div className="badge-verified">✓ Matcheo 100%</div>
                        <button 
                          type="button"
                          className="btn-fav-toggle"
                          onClick={(e) => toggleFavorito(sello, e)}
                          title="Quitar de Favoritos"
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#FEF2F2',
                            border: '1px solid #F87171',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '15px',
                            zIndex: 10
                          }}
                        >
                          ❤️
                        </button>
                        <img src={sello.imagen} alt={sello.codigoEquivalente} className="card-seal-img" />
                      </div>

                      <div className="card-body">
                        <div style={{ marginBottom: '4px' }}>
                          <div className="card-code">{sello.id}</div>
                        </div>
                        <h3 className="card-title">{sello.codigoEquivalente}</h3>
                        
                        <div className="card-spec">
                          <div className="spec-item"><span className="spec-label">Equivalencia:</span><span className="spec-val">{sello.equivalenteCompetidor}</span></div>
                          <div className="spec-item"><span className="spec-label">Bomba:</span><span className="spec-val">{sello.marcaBombaCompatible} - {sello.modeloBombaCompatible}</span></div>
                          <div className="spec-item"><span className="spec-label">Medidas:</span><span className="spec-val">{sello.medidasDetalle || sello.diametroEje}</span></div>
                        </div>

                        <div className="card-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button className="btn btn-secondary full-width" style={{ padding: '8px', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); handleVerDetalle(sello); }}>
                            🔍 Ver Ficha
                          </button>
                          <button className="btn btn-whatsapp full-width" style={{ padding: '8px', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); handleWhatsApp(sello); }}>
                            💬 Cotizar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISTA DEDICADA: MIS COTIZACIONES ENVIADAS (WHATSAPP) */}
      {currentView === 'mis-consultas' && (
        <div className="results-page-wrapper">
          <div className="container">
            <span className="back-link" onClick={() => navegarA('home', 'home')}>
              ← Volver al Buscador Principal
            </span>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800 }}>📋 Mis Cotizaciones Enviadas (WhatsApp)</h1>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
                    Registro oficial de repuestos que derivaste a cotización con un asesor de <strong>Graphite Technologies</strong>.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => navegarA('home', 'home')}>
                  🔍 Nueva Búsqueda
                </button>
              </div>

              {historialConsultasCliente.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-text-muted)' }}>
                  <span style={{ fontSize: '48px' }}>💬</span>
                  <p style={{ fontSize: '16px', fontWeight: 700, marginTop: '12px', color: 'var(--color-text-main)' }}>Aún no enviaste cotizaciones por WhatsApp.</p>
                  <p style={{ fontSize: '14px', marginTop: '4px' }}>Cuando encuentres un sello y toques "Cotizar por WhatsApp", se registrará en este historial.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Fecha / ID Cotización</th>
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
                    <h2 style={{ fontSize: '24px', fontWeight: 800 }}>
                      {userIdentity?.role === 'admin' ? '👑 Panel de Control & Administración General' : '💼 Panel Interno de Gestión de Ventas & Catálogo'}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                      Sesión activa: <strong>{userIdentity?.email || (userIdentity?.role === 'admin' ? 'martin.hellwing@graphite.com' : 'vendedor@graphite.com')}</strong> ({userIdentity?.name || 'Personal Autorizado'})
                    </p>
                  </div>
                  <span className="empresa-badge-auth" style={{ 
                    backgroundColor: userIdentity?.role === 'admin' ? '#991B1B' : '#0F172A',
                    color: userIdentity?.role === 'admin' ? '#FEF2F2' : '#38BDF8',
                    border: userIdentity?.role === 'admin' ? '1px solid #DC2626' : '1px solid #334155'
                  }}>
                    {userIdentity?.role === 'admin' ? '👑 Administrador General' : '👔 Cotizador / Vendedor'}
                  </span>
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
                  {userIdentity?.role === 'admin' && (
                    <button 
                      className={`tab-btn ${empresaSubTab === 'metricas' ? 'active' : ''}`}
                      onClick={() => setEmpresaSubTab('metricas')}
                    >
                      📊 Métricas del MVP (Lean Canvas)
                    </button>
                  )}
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

                {empresaSubTab === 'metricas' && userIdentity?.role === 'admin' && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>
                      Métricas Clave del MVP (Validación Lean Canvas)
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                      Indicadores de rendimiento comercial y operativo de Graphite Technologies en tiempo real.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                      <div className="stat-box" style={{ textAlign: 'left', padding: '18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Tiempo Promedio de Respuesta</div>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: '#10B981', margin: '4px 0' }}>3.2 min</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Meta: &lt; 5 min (antes &gt; 60 min)</div>
                      </div>

                      <div className="stat-box" style={{ textAlign: 'left', padding: '18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Autonomía del Cotizador</div>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: '#3B82F6', margin: '4px 0' }}>88.5%</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Consultas resueltas sin recurrir a vendedor senior</div>
                      </div>

                      <div className="stat-box" style={{ textAlign: 'left', padding: '18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Horas Ahorradas / Semana</div>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: '#D20A11', margin: '4px 0' }}>38 hs</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Impacto acumulado en el equipo comercial</div>
                      </div>

                      <div className="stat-box" style={{ textAlign: 'left', padding: '18px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Catálogo en Base de Datos</div>
                        <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>{catalogoLocal.length} sellos</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Modelos y equivalencias verificadas</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '16px' }}>
                      <strong style={{ color: '#991B1B', fontSize: '14px' }}>👑 Control de Administración Exclusivo:</strong>
                      <p style={{ fontSize: '13px', color: '#7F1D1D', marginTop: '4px', lineHeight: 1.5 }}>
                        Conectado como <strong>martin.hellwing@graphite.com</strong>. Podés gestionar nuevos cotizadores, autorizar altas de catálogo masivas y exportar el informe de cotizaciones para el ERP interno.
                      </p>
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
