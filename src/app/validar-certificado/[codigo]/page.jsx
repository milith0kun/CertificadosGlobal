import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import StatusBadge from '@/components/ui/StatusBadge';
import Card from '@/components/ui/Card';
import { generateQrUrl, generateValidationUrl } from '@/lib/code-generator';
import Image from 'next/image';

// Optamos por no usar SSR estático forzado para que siempre esté actualizado,
// pero usamos el caché de Next.js.
export const dynamic = 'force-dynamic';

export default async function ValidarCertificadoPage({ params }) {
  const { codigo } = await params;

  await connectDB();

  const doc = await Certificate.findOne({ codigoCertificado: codigo }).lean();

  if (!doc) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Card style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Certificado no encontrado</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>El código ingresado ({codigo}) no existe en nuestra base de datos o ha sido anulado.</p>
        </Card>
      </div>
    );
  }

  const isEstudiante = doc.tipoCertificado === 'student_certificate';
  const nombre = doc.datosPersona?.nombreCompleto || 'Desconocido';
  const programa = doc.datosCursoPrograma?.nombre || 'Desconocido';
  const fecha = doc.fechaEmision || doc.createdAt;
  const estado = doc.estado;
  const validationUrl = doc.validationUrl || generateValidationUrl(doc.codigoCertificado);
  const qrUrl = generateQrUrl(validationUrl, '');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem 1rem' }}>
      <style>{`
        .verify-card { max-width: 600px; width: 100%; text-align: center; overflow: hidden; }
        .verify-header { background: #0c2844; padding: 2rem 1rem; color: white; }
        .verify-body { padding: 2rem; background: white; }
        .data-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; text-align: left; margin-top: 1.5rem; }
        @media (min-width: 480px) { .data-grid { grid-template-columns: 1fr 1fr; } }
        .data-item-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; margin-bottom: 0.25rem; }
        .data-item-value { font-size: 1rem; color: #0f172a; font-weight: 600; }
        .success-icon { width: 64px; height: 64px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem auto; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4); }
        .certificate-qr { width: 150px; height: 150px; display: block; margin: 1rem auto 0; border: 1px solid #e2e8f0; border-radius: 12px; }
      `}</style>
      
      {/* 1. PDF GIGANTE ARRIBA */}
      {doc.pdfUrl && (
        <Card className="verify-card" style={{ marginBottom: '1.5rem' }} padding="0">
          <div style={{ background: '#0f172a', padding: '1rem', color: 'white', fontWeight: 600, fontSize: '1rem' }}>
            Vista Previa del Documento Oficial
          </div>
          <iframe 
            src={doc.pdfUrl.replace('/view?usp=drivesdk', '/preview')} 
            style={{ width: '100%', height: '600px', border: 'none', background: '#f1f5f9' }}
            allow="autoplay"
          ></iframe>
        </Card>
      )}

      {/* 2. METADATOS Y CHECK VERDE ABAJO */}
      <Card className="verify-card" padding="0">
        <div className="verify-header">
          <div className="success-icon">✓</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Documento Auténtico</h1>
          <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.5rem' }}>Verificado oficialmente por el sistema</p>
        </div>
        
        <div className="verify-body">
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CÓDIGO DE VERIFICACIÓN</span>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: '#0c2844', letterSpacing: '2px', marginTop: '0.25rem' }}>
              {codigo}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <StatusBadge state={estado} />
            </div>
            <Image
              className="certificate-qr"
              src={qrUrl}
              alt={`QR de validación del certificado ${codigo}`}
              width={150}
              height={150}
              unoptimized
            />
          </div>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '1.5rem 0' }}></div>

          <div className="data-grid">
            <div>
              <div className="data-item-label">Emitido a favor de</div>
              <div className="data-item-value">{nombre}</div>
            </div>
            <div>
              <div className="data-item-label">Tipo de Documento</div>
              <div className="data-item-value">{isEstudiante ? 'Certificado de Estudiante' : 'Certificado de Docente'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="data-item-label">Programa / Curso</div>
              <div className="data-item-value">{programa}</div>
            </div>
            {!isEstudiante && doc.datosCursoPrograma?.rolDocente && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="data-item-label">Rol desempeñado</div>
                <div className="data-item-value">{doc.datosCursoPrograma.rolDocente}</div>
              </div>
            )}
            <div>
              <div className="data-item-label">Fecha de Emisión</div>
              <div className="data-item-value">{new Date(fecha).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div>
              <div className="data-item-label">Entidad Emisora</div>
              <div className="data-item-value">Certificados Global / CIIP Latam</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
