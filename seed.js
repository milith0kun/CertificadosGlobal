import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

const MONGODB_URI = 'mongodb+srv://174449_db_user:1997281qA@cluster0.feeeugl.mongodb.net/certificados_global?retryWrites=true&w=majority&appName=Cluster0';

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');
    
    const email = 'admin@certificadosglobal.com';
    const existing = await User.findOne({ email });
    
    if (existing) {
      console.log('Admin user already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        nombres: 'Administrador',
        apellidos: 'Sistema',
        nombreCompleto: 'Administrador del Sistema',
        email,
        password: hashedPassword,
        rol: 'admin',
        estado: 'activo'
      });
      console.log('Admin user created successfully! email: admin@certificadosglobal.com, pass: admin123');
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
