'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CrearContratoDocente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombreDocente: '',
    dni: '',
    programa: '',
    modulo: '',
    fechas: '',
    remuneracion: '',
    plantillaFondo: 'CONTRATO_FONDO.png'
  });

  useEffect(() => {
    fetch('/api/admin/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contratos-docentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datosPersona: { nombreCompleto: formData.nombreDocente, documento: formData.dni },
          datosCursoPrograma: { nombre: formData.programa },
          modulos: [{ nombre: formData.modulo, remuneracion: formData.remuneracion }],
          estado: 'issued'
        })
      });

      if (!res.ok) throw new Error('Error al guardar contrato');
      const doc = await res.json();

      const pdfRes = await fetch('/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: doc._id,
          type: 'docente'
        })
      });

      if (pdfRes.ok) {
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Contrato_${formData.nombreDocente}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        alert('✅ Contrato emitido y descargado');
        router.push('/admin/contratos-docentes');
      } else {
        alert('Guardado en BD, pero falló la generación del PDF. ¿Subiste el fondo a Drive?');
        router.push('/admin/contratos-docentes');
      }
    } catch (err) {
      alert('Error en la emisión');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-heading); margin-bottom: 0.5rem; }
        .form-input { width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--card-border); background: var(--glass-bg); font-family: var(--font-body); color: var(--text-main); }
        .form-input:focus { border-color: var(--primary); outline: none; }
      `}</style>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Emitir Contrato Docente</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Completa los datos del docente y los módulos a dictar.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo del Docente</label>
            <input required type="text" className="form-input" value={formData.nombreDocente} onChange={e => setFormData({...formData, nombreDocente: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">DNI</label>
            <input required type="text" className="form-input" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Programa</label>
            <select required className="form-input" value={formData.programa} onChange={e => setFormData({...formData, programa: e.target.value})}>
              <option value="">-- Seleccionar Programa --</option>
              {productos.map(p => (
                <option key={p._id} value={p.nombre}>{p.nombre}</option>
              ))}
              <option value="OTRO">✏️ Otro (Escribir manualmente)</option>
            </select>
            {formData.programa === 'OTRO' && (
              <input style={{marginTop: '0.5rem'}} required type="text" className="form-input" placeholder="Escribe el nombre del programa..." onChange={e => setFormData({...formData, programa: e.target.value})} />
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Módulo</label>
            <input required type="text" className="form-input" value={formData.modulo} onChange={e => setFormData({...formData, modulo: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Remuneración Total (Ej. S/ 500.00)</label>
            <input required type="text" className="form-input" value={formData.remuneracion} onChange={e => setFormData({...formData, remuneracion: e.target.value})} />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Generando PDF...' : 'Emitir y Descargar Contrato'}
          </Button>
        </form>
      </Card>
    </>
  );
}
