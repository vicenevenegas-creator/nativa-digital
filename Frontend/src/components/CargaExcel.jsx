import React, { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file/browser';
import { supabase } from '../supabase';
import { procesarLibro } from '../lib/catalogoExcel';

const LOTE = 500;
const CLAVE_COMPAT = 'marca_bomba,modelo_bomba,eje_mm,fluido,codigo_sello';

const cajaEstilo = (color, fondo) => ({
  border: `1px solid ${color}`,
  background: fondo,
  borderRadius: '10px',
  padding: '14px 16px',
  marginBottom: '16px',
  fontSize: '14px'
});

export default function CargaExcel() {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState('inicial'); // inicial | leyendo | listo | subiendo | subido | error
  const [mensaje, setMensaje] = useState('');
  const [totales, setTotales] = useState(null);

  const contarEnBase = async () => {
    const [sellos, compat] = await Promise.all([
      supabase.from('sellos').select('codigo', { count: 'exact', head: true }),
      supabase.from('compatibilidades').select('id', { count: 'exact', head: true })
    ]);
    if (!sellos.error && !compat.error) {
      setTotales({ sellos: sellos.count, compatibilidades: compat.count });
    }
  };

  useEffect(() => { contarEnBase(); }, []);

  const handleArchivo = async (e) => {
    const file = e.target.files?.[0];
    setResultado(null);
    setMensaje('');
    if (!file) return;
    setArchivo(file);
    setEstado('leyendo');
    try {
      const [hojas, { data: existentes, error }] = await Promise.all([
        readXlsxFile(file),
        supabase.from('sellos').select('codigo')
      ]);
      if (error) throw error;
      const res = procesarLibro(hojas, (existentes || []).map((s) => s.codigo));
      setResultado(res);
      setEstado(res.errores.length ? 'error' : 'listo');
    } catch (err) {
      setEstado('error');
      setMensaje(`No se pudo leer el archivo: ${err.message}. Verificá que sea la plantilla .xlsx.`);
    }
  };

  const subirEnLotes = async (tabla, filas, opciones) => {
    for (let i = 0; i < filas.length; i += LOTE) {
      const { error } = await supabase.from(tabla).upsert(filas.slice(i, i + LOTE), opciones);
      if (error) throw error;
    }
  };

  const handleSubir = async () => {
    if (!resultado || resultado.errores.length) return;
    setEstado('subiendo');
    setMensaje('');
    try {
      // Los sellos van primero: las compatibilidades apuntan a su código.
      // Si el código ya existe se actualiza el nombre; las fotos no se tocan.
      await subirEnLotes('sellos', resultado.sellos, { onConflict: 'codigo' });
      await subirEnLotes('compatibilidades', resultado.compatibilidades, {
        onConflict: CLAVE_COMPAT,
        ignoreDuplicates: true
      });
      setEstado('subido');
      setMensaje(`Listo: se procesaron ${resultado.sellos.length} sellos y ${resultado.compatibilidades.length} compatibilidades.`);
      contarEnBase();
    } catch (err) {
      setEstado('listo');
      const sinPermiso = /row-level security|permission/i.test(err.message || '');
      setMensaje(sinPermiso
        ? 'Supabase rechazó la carga: solo puede subir el personal con correo @graphite.com.ar que inició sesión.'
        : `Error al subir: ${err.message}`);
    }
  };

  const errores = resultado?.errores || [];
  const avisos = resultado?.avisos || [];

  return (
    <div style={{ maxWidth: '760px', marginBottom: '40px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>Carga masiva desde Excel</h3>
      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
        Subí la plantilla <strong>Plantilla_catalogo_sellos.xlsx</strong> con las hojas Sellos y Compatibilidades.
        Podés volver a subir la misma planilla corregida: lo que ya está cargado no se duplica.
        {totales && <> Hoy hay <strong>{totales.sellos}</strong> sellos y <strong>{totales.compatibilidades}</strong> compatibilidades en la base.</>}
      </p>

      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label className="form-label" htmlFor="archivo-excel">Archivo Excel (.xlsx)</label>
        <input
          id="archivo-excel"
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="form-input"
          onChange={handleArchivo}
          disabled={estado === 'leyendo' || estado === 'subiendo'}
        />
      </div>

      {estado === 'leyendo' && <p style={{ fontSize: '14px' }}>Leyendo {archivo?.name}…</p>}

      {resultado && (
        <div style={cajaEstilo('var(--color-border)', 'var(--color-bg-light)')}>
          <strong>{archivo?.name}</strong>: {resultado.sellos.length} sellos y {resultado.compatibilidades.length} compatibilidades listas para subir.
        </div>
      )}

      {errores.length > 0 && (
        <div style={cajaEstilo('#DC2626', '#FEF2F2')}>
          <strong style={{ color: '#991B1B' }}>Hay {errores.length} {errores.length === 1 ? 'error' : 'errores'} para corregir en el Excel antes de subir:</strong>
          <ul style={{ margin: '8px 0 0 18px' }}>
            {errores.slice(0, 50).map((e) => <li key={e}>{e}</li>)}
          </ul>
          {errores.length > 50 && <p style={{ marginTop: '6px' }}>…y {errores.length - 50} más.</p>}
        </div>
      )}

      {avisos.length > 0 && (
        <div style={cajaEstilo('var(--color-warning)', '#FFFBEB')}>
          <strong>Avisos ({avisos.length}):</strong>
          <ul style={{ margin: '8px 0 0 18px' }}>
            {avisos.slice(0, 20).map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      )}

      {mensaje && (
        <div style={estado === 'subido'
          ? cajaEstilo('var(--color-success)', 'var(--color-success-bg)')
          : cajaEstilo('#DC2626', '#FEF2F2')}
        >
          {mensaje}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary full-width"
        style={{ padding: '14px' }}
        onClick={handleSubir}
        disabled={estado !== 'listo'}
      >
        {estado === 'subiendo' ? 'Subiendo…' : 'Subir sellos y compatibilidades a la base'}
      </button>
    </div>
  );
}
