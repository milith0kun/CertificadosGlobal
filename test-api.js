import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { generarCertificadoGoogle } from './src/lib/google-generator.js';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

async function testApi() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', new mongoose.Schema({}, { strict: false }));
  
  const doc = await Certificate.findOne({}).lean();
  if (!doc) {
    console.log('No certificates found!');
    process.exit(1);
  }

  console.log(`Test with certificate: ${doc.codigoCertificado}`);
  
  const templateId = '1YJiolK2rZS6X-qxMfoBaPkddk_b-c7wsVI8ymOedpys'; 
  const nombreArchivo = `CERT_${doc.codigoCertificado}`;
  const folderDestino = '1yHUepgZklBvh121CP07zKTp0qXdKNN8v';
  
  const datosReemplazo = {
    NOMBRE: doc.datosPersona?.nombreCompleto || 'SIN NOMBRE',
    PROGRAMA: doc.datosCursoPrograma?.nombre || 'SIN PROGRAMA',
    FECHA: new Date().toLocaleDateString('es-PE'),
    QR: `https://certificaciones.ecosdelseo.com/validar-certificado/${doc.codigoCertificado}`
  };

  try {
    const pdfBuffer = await generarCertificadoGoogle(datosReemplazo, templateId, folderDestino, nombreArchivo);
    console.log('Success! Buffer length:', pdfBuffer.length);
  } catch (err) {
    console.error('API Error:', err);
  }
  process.exit(0);
}

testApi();
