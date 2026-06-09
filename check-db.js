import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  nombre: String,
  marcaId: String,
  estado: String,
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function check() {
  await mongoose.connect(MONGODB_URI);
  const products = await Product.find({}).lean();
  console.log(`Hay ${products.length} productos en BD:`);
  products.forEach(p => console.log(`- [${p.marcaId}] ${p.nombre}`));
  process.exit(0);
}
check();
