import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

async function testMongoose() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Certificate = (await import('./src/models/Certificate.js')).default;
  const { generateUniqueCode } = await import('./src/lib/code-generator.js');
  
  const data = {
    datosPersona: { nombreCompleto: 'Prueba Local' },
    datosCursoPrograma: { nombre: 'Curso Prueba' },
    marcaId: 'ciip_latam',
    estado: 'issued'
  };

  data.codigoCertificado = generateUniqueCode('student_certificate');
  data.tipoCertificado = 'student_certificate';

  try {
    const cert = await Certificate.create(data);
    console.log('Saved!', cert._id);
  } catch (err) {
    console.error('MONGOOSE ERROR:', err);
  }
  process.exit(0);
}

testMongoose();
