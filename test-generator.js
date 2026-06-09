import fs from 'fs';
import { generarCertificadoGoogle } from './src/lib/google-generator.js';

async function test() {
  console.log('Iniciando prueba de generación de certificado...');
  try {
    const templateId = '1YJiolK2rZS6X-qxMfoBaPkddk_b-c7wsVI8ymOedpys'; 
    const folderDestino = '1yHUepgZklBvh121CP07zKTp0qXdKNN8v'; // Carpeta raiz compartida
    const nombreArchivo = 'CERT_PRUEBA_123';
    
    const datosReemplazo = {
      NOMBRE: 'JUAN PÉREZ DE EJEMPLO',
      PROGRAMA: 'PROGRAMA DE ALTA ESPECIALIZACIÓN EN PERFORACIÓN',
      FECHA: new Date().toLocaleDateString('es-PE'),
      QR: 'https://certificaciones.ecosdelseo.com/validar-certificado/CERT-PRUEBA-123'
    };

    const pdfBuffer = await generarCertificadoGoogle(datosReemplazo, templateId, folderDestino, nombreArchivo);
    
    fs.writeFileSync('./public/ejemplo.pdf', pdfBuffer);
    console.log('PDF generado exitosamente en ./public/ejemplo.pdf');
    process.exit(0);
  } catch (error) {
    console.error('Error al generar:', error);
    process.exit(1);
  }
}

test();
