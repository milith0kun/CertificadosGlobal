'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CrearCertificadoEstudiante() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombreAlumno: '',
    curso: '',
    marca: 'ciip_latam',
    plantillaFondo: 'CIIP_GENERAL_FONDO.png'
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
      const res = await fetch('/api/admin/certificados-estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datosPersona: { nombreCompleto: formData.nombreAlumno },
          datosCursoPrograma: { nombre: formData.curso },
          marcaId: formData.marca,
          estado: 'issued'
        })
      });

      if (!res.ok) throw new Error('Error al guardar certificado');
      const cert = await res.json();

      const pdfRes = await fetch('/api/admin/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: cert._id,
          type: 'estudiante'
        })
      });

      if (pdfRes.ok) {
        const blob = await pdfRes.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cert.codigoCertificado}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        alert('✅ Certificado emitido y descargado');
        router.push('/admin/certificados-estudiantes');
      } else {
        alert('Guardado en BD, pero falló la generación del PDF. ¿Subiste el fondo a Drive?');
        router.push('/admin/certificados-estudiantes');
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Emitir Nuevo Certificado</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Completa los datos para generar el PDF al instante.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo del Alumno</label>
            <input required type="text" className="form-input" placeholder="Ej. Juan Pérez" value={formData.nombreAlumno} onChange={e => setFormData({...formData, nombreAlumno: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Curso / Programa</label>
            <select required className="form-input" value={formData.curso} onChange={e => setFormData({...formData, curso: e.target.value})}>
              <option value="">-- Seleccionar Curso --</option>
              {productos.map(p => (
                <option key={p._id} value={p.nombre}>{p.nombre}</option>
              ))}
              <option value="OTRO">✏️ Otro (Escribir manualmente)</option>
            </select>
            {formData.curso === 'OTRO' && (
              <input style={{marginTop: '0.5rem'}} required type="text" className="form-input" placeholder="Escribe el nombre del curso..." onChange={e => setFormData({...formData, curso: e.target.value})} />
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Marca (Logo)</label>
            <select className="form-input" value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})}>
              <option value="ciip_latam">CIIP LATAM</option>
              <option value="geomina">Geomina</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nombre del Fondo en Google Drive (Temporal)</label>
            <input required type="text" className="form-input" value={formData.plantillaFondo} onChange={e => setFormData({...formData, plantillaFondo: e.target.value})} />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Generando PDF...' : 'Emitir y Descargar PDF'}
          </Button>
        </form>
      </Card>
    </>
  );
}
