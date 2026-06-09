import mongoose from 'mongoose';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  nombre: String,
  slug: String,
  marcaId: String,
  tipoProducto: String,
  estado: String,
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function fix() {
  await mongoose.connect(MONGODB_URI);
  
  const excelContratos = xlsx.readFile('AUTOMATIZACIÓN - CONTRATO - DOCENTES.xlsx');
  const docentesSheet = excelContratos.Sheets['DOCENTES DATOS'];
  const dataDocentes = xlsx.utils.sheet_to_json(docentesSheet, { header: 1 });
  const progsDocentes = new Set();
  
  dataDocentes.forEach((row, i) => {
    if (i > 0 && row[3]) {
      // Limpiar saltos de línea y espacios extra
      const cleanName = row[3].toString().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').replace(/"/g, '').trim();
      if (cleanName.length > 5 && !cleanName.startsWith('Psj.')) {
        progsDocentes.add(cleanName);
      }
    }
  });

  const progsArray = Array.from(progsDocentes);
  console.log(`Encontrados ${progsArray.length} programas limpios.`);

  for (const prog of progsArray) {
    const slug = prog.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await Product.updateOne(
      { slug },
      { 
        $set: { 
          nombre: prog, 
          slug: slug, 
          marcaId: 'ciip_latam', 
          tipoProducto: 'programa',
          estado: 'activo'
        }
      },
      { upsert: true }
    );
  }
  
  console.log('Productos corregidos e insertados.');
  process.exit(0);
}
fix();
