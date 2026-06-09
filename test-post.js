import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

async function testPost() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = (await import('./src/models/User.js')).default;
  const user = await User.findOne({ email: 'admin@certificadosglobal.com' });
  
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, rol: user.rol, nombreCompleto: user.nombreCompleto },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const res = await fetch('http://localhost:3001/api/admin/certificados-estudiantes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `auth_token=${token}`
    },
    body: JSON.stringify({
      datosPersona: { nombreCompleto: 'Juan Perez' },
      datosCursoPrograma: { nombre: 'Curso' },
      marcaId: 'ciip_latam',
      estado: 'issued'
    })
  });

  console.log('Status:', res.status);
  console.log('Body:', await res.text());
  process.exit(0);
}

testPost();
