import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const lastCert = await db.collection('certificates').find().sort({_id: -1}).limit(1).toArray();
  console.log('Last Certificate:', lastCert[0]);
  process.exit(0);
}
check();
