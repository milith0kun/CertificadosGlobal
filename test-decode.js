import fs from 'fs';
import { generateQRBuffer } from './src/lib/pdf-generator.js';

async function test() {
  const buf = await generateQRBuffer('https://certificaciones.ecosdelseo.com/validar-certificado/CERT-123');
  fs.writeFileSync('test-qr.png', buf);
  console.log('QR length:', buf.length);
}
test();
