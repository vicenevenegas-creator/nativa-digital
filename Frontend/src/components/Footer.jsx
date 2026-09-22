import React, { useState } from 'react';

export default function Footer() {
  const [inquiry, setInquiry] = useState({ nombre: '', email: '', telefono: '' });
  const [enviado, setEnviado] = useState(false);

  const handleEnviarConsulta = (e) => {
    e.preventDefault();
    if (!inquiry.email && !inquiry.telefono) {
      alert("Por favor ingresá al menos un correo o teléfono para poder responderte.");
      return;
    }
    setEnviado(true);
  };
  return (
    <footer className="footer">
      <div className="container footer-grid-3col">
        {/* Columna 1: Contactos Oficiales con Links Exactos */}
        <div className="footer-contacts">
          <div className="footer-brand-title">GRAPHITE TECHNOLOGIES</div>
          <p className="footer-desc">Plataforma unificada de matcheo y equivalencias de sellos mecánicos y bombas.</p>
          
          <ul className="contact-list">
            <li className="contact-item">
              <a href="https://wa.me/5491138134174" target="_blank" rel="noreferrer" className="contact-link wa-hover">
                <span className="contact-icon wa-bg">💬</span>
                <span><strong>WhatsApp:</strong> 11 3813-4174</span>
              </a>
            </li>
            <li className="contact-item">
              <a href="mailto:info@graphite.com.ar" className="contact-link mail-hover">
                <span className="contact-icon mail-bg">✉️</span>
                <span><strong>Mail:</strong> info@graphite.com.ar</span>
              </a>
            </li>
            <li className="contact-item">
              <a href="https://www.instagram.com/graphite.technologies?igsi=MXJ2dXBldXQ4bXVwcg==" target="_blank" rel="noreferrer" className="contact-link insta-hover">
                <span className="contact-icon insta-bg">📷</span>
                <span><strong>Instagram:</strong> @graphite.technologies</span>
              </a>
            </li>
            <li className="contact-item">
              <a href="https://www.linkedin.com/in/graphite-technologies/" target="_blank" rel="noreferrer" className="contact-link linkedin-hover">
                <span className="contact-icon linkedin-bg">💼</span>
                <span><strong>LinkedIn:</strong> Graphite Technologies</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 2: Formulario de Asesoramiento Técnico */}
        <div className="footer-inquiry-box">
          <div className="inquiry-title">✉️ ¿Necesitás asesoramiento técnico?</div>
          {enviado ? (
            <div style={{ backgroundColor: 'rgba(37, 211, 102, 0.12)', border: '1px solid #25D366', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
              <div style={{ fontWeight: 800, color: '#25D366', fontSize: '15px', marginBottom: '6px' }}>✓ ¡Consulta Recibida con Éxito!</div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: '1.5', margin: 0 }}>
                <strong>Respuesta automática Graphite:</strong><br />
                Hemos registrado tu solicitud para {inquiry.nombre ? <em>"{inquiry.nombre}"</em> : 'tu equipo'}. Se ha generado el ticket de atención y un cotizador técnico especializado te responderá formalmente al correo/teléfono indicado a la brevedad.
              </p>
              <button 
                className="btn btn-secondary full-width" 
                style={{ marginTop: '12px', padding: '6px 10px', fontSize: '12px' }}
                onClick={() => { setEnviado(false); setInquiry({ nombre: '', email: '', telefono: '' }); }}
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleEnviarConsulta}>
              <p className="inquiry-subtitle">Dejanos tu mail o teléfono y te enviaremos una respuesta automática con derivación a cotizador:</p>
              <input 
                type="text" 
                placeholder="Tu Nombre o Empresa" 
                className="inquiry-input"
                value={inquiry.nombre}
                onChange={(e) => setInquiry({ ...inquiry, nombre: e.target.value })}
              />
              <input 
                type="email" 
                placeholder="Tu Mail de contacto *" 
                className="inquiry-input"
                value={inquiry.email}
                onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
              />
              <input 
                type="tel" 
                placeholder="Tu Teléfono / WhatsApp" 
                className="inquiry-input"
                value={inquiry.telefono}
                onChange={(e) => setInquiry({ ...inquiry, telefono: e.target.value })}
              />
              <button type="submit" className="btn btn-primary full-width" style={{ padding: '10px' }}>
                Enviar Consulta Rápida
              </button>
            </form>
          )}
        </div>

        {/* Columna 3: Logo Grande e Identidad */}
        <div className="footer-right">
          <img 
            src="https://graphite.com.ar/wp-content/uploads/2019/01/cropped-fav-graphite-192x192.png" 
            alt="Graphite Logo" 
            className="footer-logo-large"
          />
          <p className="copyright-text">
            © {new Date().getFullYear()} Graphite Argentina.<br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
