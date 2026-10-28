import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase';
import { urlFoto } from '../lib/catalogo';
import { TIPOS, esArchivoValido, rutaArchivo, interpretarNombreArchivo } from '../lib/fotosSellos';

const caja = (color, fondo) => ({
  border: `1px solid ${color}`, background: fondo, borderRadius: '10px',
  padding: '12px 16px', marginBottom: '16px', fontSize: '14px'
});

export default function CargaFotos() {
  const [sellos, setSellos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(''); // '<codigo>|<tipo>' o 'masiva'
  const [mensajes, setMensajes] = useState([]); // [{ ok, texto }]
  const [filtro, setFiltro] = useState('');
  const inputIndividual = useRef(null);
  const destino = useRef(null); // { codigo, tipo } del botón que se tocó

  const cargarSellos = async () => {
    const { data, error } = await supabase
      .from('sellos')
      .select('codigo, nombre, foto_producto, foto_plano')
      .order('codigo');
    if (error) setMensajes([{ ok: false, texto: `No se pudieron leer los sellos: ${error.message}` }]);
    else setSellos(data || []);
    setCargando(false);
  };

  useEffect(() => { cargarSellos(); }, []);

  // Sube el archivo, guarda la ruta en el sello y borra el archivo anterior.
  const subirArchivo = async (codigo, tipo, archivo) => {
    const { columna } = TIPOS[tipo];
    const anterior = sellos.find((s) => s.codigo === codigo)?.[columna];
    const ruta = rutaArchivo(codigo, tipo, archivo.name);
    const { error: errorSubida } = await supabase.storage
      .from('sellos')
      .upload(ruta, archivo, { contentType: archivo.type || undefined });
    if (errorSubida) throw errorSubida;
    const { error: errorSello } = await supabase.from('sellos').update({ [columna]: ruta }).eq('codigo', codigo);
    if (errorSello) {
      await supabase.storage.from('sellos').remove([ruta]);
      throw errorSello;
    }
    if (anterior && !/^https?:\/\//i.test(anterior)) {
      await supabase.storage.from('sellos').remove([anterior]);
    }
  };

  const explicarError = (err) => (/row-level security|permission|unauthorized|403/i.test(err.message || '')
    ? 'sin permiso: tenés que iniciar sesión con tu correo @graphite.com.ar'
    : err.message);

  const elegirArchivo = (codigo, tipo) => {
    destino.current = { codigo, tipo };
    inputIndividual.current.accept = TIPOS[tipo].acepta;
    inputIndividual.current.value = '';
    inputIndividual.current.click();
  };

  const handleIndividual = async (e) => {
    const archivo = e.target.files?.[0];
    const { codigo, tipo } = destino.current || {};
    if (!archivo || !codigo) return;
    if (!esArchivoValido(tipo, archivo.name)) {
      setMensajes([{ ok: false, texto: `${archivo.name}: ${tipo === 'plano' ? 'el plano tiene que ser imagen o PDF' : 'la foto tiene que ser una imagen'}.` }]);
      return;
    }
    setSubiendo(`${codigo}|${tipo}`);
    try {
      await subirArchivo(codigo, tipo, archivo);
      setMensajes([{ ok: true, texto: `Se cargó ${TIPOS[tipo].etiqueta === 'foto' ? 'la foto' : 'el plano'} de ${codigo}.` }]);
    } catch (err) {
      setMensajes([{ ok: false, texto: `${codigo}: ${explicarError(err)}` }]);
    }
    setSubiendo('');
    cargarSellos();
  };

  const handleMasiva = async (e) => {
    const archivos = [...(e.target.files || [])];
    e.target.value = '';
    if (!archivos.length) return;
    setSubiendo('masiva');
    const codigos = sellos.map((s) => s.codigo);
    const resultado = [];
    for (const archivo of archivos) {
      const destinoArchivo = interpretarNombreArchivo(archivo.name, codigos);
      if (destinoArchivo.error) {
        resultado.push({ ok: false, texto: `${archivo.name}: ${destinoArchivo.error}.` });
        continue;
      }
      try {
        await subirArchivo(destinoArchivo.codigo, destinoArchivo.tipo, archivo);
        resultado.push({ ok: true, texto: `${archivo.name} → ${TIPOS[destinoArchivo.tipo].etiqueta} de ${destinoArchivo.codigo}` });
      } catch (err) {
        resultado.push({ ok: false, texto: `${archivo.name}: ${explicarError(err)}` });
      }
      await cargarSellos(); // para que el próximo archivo del mismo sello borre el anterior correcto
    }
    setMensajes(resultado);
    setSubiendo('');
  };

  const conFoto = sellos.filter((s) => s.foto_producto).length;
  const conPlano = sellos.filter((s) => s.foto_plano).length;
  const visibles = sellos.filter((s) => `${s.codigo} ${s.nombre}`.toLowerCase().includes(filtro.toLowerCase()));
  const ok = mensajes.filter((m) => m.ok);
  const errores = mensajes.filter((m) => !m.ok);

  const celdaArchivo = (sello, tipo) => {
    const ruta = sello[TIPOS[tipo].columna];
    const url = urlFoto(ruta);
    const ocupado = subiendo === `${sello.codigo}|${tipo}`;
    return (
      <td style={{ whiteSpace: 'nowrap' }}>
        {url ? (
          /\.pdf$/i.test(ruta) ? (
            <a href={url} target="_blank" rel="noreferrer" style={{ marginRight: '8px' }}>PDF</a>
          ) : (
            <a href={url} target="_blank" rel="noreferrer">
              <img src={url} alt={`${TIPOS[tipo].etiqueta} de ${sello.codigo}`} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', verticalAlign: 'middle', marginRight: '8px', border: '1px solid var(--color-border)' }} />
            </a>
          )
        ) : (
          <span style={{ color: '#B45309', fontSize: '12px', marginRight: '8px' }}>Falta</span>
        )}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '6px 10px', fontSize: '12px' }}
          disabled={Boolean(subiendo)}
          onClick={() => elegirArchivo(sello.codigo, tipo)}
        >
          {ocupado ? 'Subiendo…' : url ? 'Cambiar' : 'Subir'}
        </button>
      </td>
    );
  };

  return (
    <div style={{ marginTop: '8px', marginBottom: '40px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Fotos y planos de los sellos</h3>
      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
        Subí la foto del producto y el plano de cada sello con los botones de la tabla. Para cargar muchos de una vez,
        nombrá los archivos <strong>código_producto.jpg</strong> y <strong>código_plano.pdf</strong> (o .jpg) y elegilos todos juntos.
        {!cargando && <> Hoy: <strong>{conFoto}</strong> de {sellos.length} con foto y <strong>{conPlano}</strong> con plano.</>}
      </p>

      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label className="form-label" htmlFor="fotos-masivas">Carga masiva por nombre de archivo</label>
        <input
          id="fotos-masivas"
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="form-input"
          onChange={handleMasiva}
          disabled={Boolean(subiendo) || cargando}
        />
        {subiendo === 'masiva' && <span style={{ fontSize: '13px' }}>Subiendo archivos…</span>}
      </div>

      {ok.length > 0 && (
        <div style={caja('var(--color-success)', 'var(--color-success-bg)')}>
          <strong>Cargado ({ok.length}):</strong>
          <ul style={{ margin: '6px 0 0 18px' }}>{ok.map((m) => <li key={m.texto}>{m.texto}</li>)}</ul>
        </div>
      )}
      {errores.length > 0 && (
        <div style={caja('#DC2626', '#FEF2F2')}>
          <strong style={{ color: '#991B1B' }}>No se cargó ({errores.length}):</strong>
          <ul style={{ margin: '6px 0 0 18px' }}>{errores.map((m) => <li key={m.texto}>{m.texto}</li>)}</ul>
        </div>
      )}

      <input ref={inputIndividual} type="file" style={{ display: 'none' }} onChange={handleIndividual} />

      <input
        type="search"
        className="form-input"
        placeholder="Buscar sello por código o nombre…"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ marginBottom: '12px', maxWidth: '360px' }}
      />

      {cargando ? (
        <p style={{ fontSize: '14px' }}>Cargando sellos…</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="crm-table">
            <thead>
              <tr><th>Código</th><th>Nombre</th><th>Foto del producto</th><th>Plano</th></tr>
            </thead>
            <tbody>
              {visibles.map((s) => (
                <tr key={s.codigo}>
                  <td><strong>{s.codigo}</strong></td>
                  <td style={{ fontSize: '13px' }}>{s.nombre}</td>
                  {celdaArchivo(s, 'producto')}
                  {celdaArchivo(s, 'plano')}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
