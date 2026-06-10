import { connectDB } from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import TeacherAssignment from '@/models/TeacherAssignment';
import { requireRole } from '@/lib/middleware';
import { generarCertificadoGoogle } from '@/lib/google-generator';

export async function POST(request) {
  try {
    const { error } = await requireRole('admin', 'admin_academico', 'area_administrativa');
    if (error) return error;

    const { certificateId, type = 'estudiante' } = await request.json();
    await connectDB();

    let doc, nombreArchivo, templateId, datosReemplazo;
    const folderDestino = '1yHUepgZklBvh121CP07zKTp0qXdKNN8v'; // Carpeta principal de Drive

    if (type === 'estudiante') {
      doc = await Certificate.findById(certificateId);
      if (!doc) return Response.json({ error: 'No encontrado' }, { status: 404 });
      
      templateId = '1YJiolK2rZS6X-qxMfoBaPkddk_b-c7wsVI8ymOedpys'; // Plantilla CIIP General
      nombreArchivo = `CERT_${doc.codigoCertificado}`;
      datosReemplazo = {
        NOMBRE: doc.datosPersona?.nombreCompleto || 'SIN NOMBRE',
        PROGRAMA: doc.datosCursoPrograma?.nombre || 'SIN PROGRAMA',
        FECHA: new Date().toLocaleDateString('es-PE'),
        QR: `https://certificaciones.ecosdelseo.com/validar-certificado/${doc.codigoCertificado}`
      };
    } else {
      doc = await TeacherAssignment.findById(certificateId).lean();
      if (!doc) return Response.json({ error: 'No encontrado' }, { status: 404 });
      
      templateId = '10IKFEmsaG0wqLt_Thsm_JCDOFKjpyh5yndoeSaYVzvk'; // Plantilla Programa
      nombreArchivo = `CONTRATO_${doc.datosPersona?.nombreCompleto || 'DOCENTE'}`;
      const modulo = doc.modulos && doc.modulos.length > 0 ? doc.modulos[0] : {};
      
      datosReemplazo = {
        DOCENTE: doc.datosPersona?.nombreCompleto || '',
        'DNI DOCENTE': doc.datosPersona?.documento || '',
        PROGRAMA: doc.datosCursoPrograma?.nombre || '',
        MODULO: modulo.nombre || '',
        HONORARIO: modulo.remuneracion || '',
        REMUNERACION: modulo.remuneracion || '',
        FECHA: new Date().toLocaleDateString('es-PE'),
        QR: `https://certificaciones.ecosdelseo.com/validar-certificado/${doc.codigoContrato}`
      };
    }

    // Ejecutar generación con Google Slides
    const result = await generarCertificadoGoogle(datosReemplazo, templateId, folderDestino, nombreArchivo);

    // Guardar pdfUrl en BD
    if (type === 'estudiante' && doc.save) {
      doc.pdfUrl = result.pdfUrl;
      await doc.save();
    } else if (type !== 'estudiante') {
      const Model = (await import('@/models/TeacherAssignment')).default;
      await Model.findByIdAndUpdate(certificateId, { pdfUrl: result.pdfUrl });
    }

    return new Response(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${nombreArchivo}.pdf"`
      }
    });

  } catch (err) {
    console.error('Error generating PDF:', err);
    return Response.json({ error: 'Error interno generando PDF' }, { status: 500 });
  }
}
