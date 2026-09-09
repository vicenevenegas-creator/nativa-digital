import React from 'react';

export default function Footer() {
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
          <p className="inquiry-subtitle">Dejanos tu mail o teléfono y un cotizador de Graphite te contactará en el día:</p>
          <input type="text" placeholder="Tu Nombre o Empresa" className="inquiry-input" />
          <input type="email" placeholder="Tu Mail de contacto" className="inquiry-input" />
          <input type="tel" placeholder="Tu Teléfono / WhatsApp" className="inquiry-input" />
          <button className="btn btn-primary" style={{ padding: '10px' }} onClick={() => alert("¡Gracias por tu consulta! Te contactaremos a la brevedad.")}>
            Enviar Consulta Rápida
          </button>
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
