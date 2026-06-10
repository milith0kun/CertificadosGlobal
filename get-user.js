import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const admin = await db.collection('users').findOne({rol: 'admin'});
  console.log('Admin user:', admin?.email);
  process.exit(0);
}
check();
