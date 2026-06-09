import mongoose from 'mongoose';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' }); // Intenta leer ambas

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  nombre: String,
  slug: String,
  marcaId: String,
  tipoProducto: String,
  estado: String,
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const UserSchema = new mongoose.Schema({
  nombreCompleto: String,
  nombres: String,
  apellidos: String,
  email: String,
  password: String,
  documento: String,
  rol: String,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const CertificateSchema = new mongoose.Schema({
  alumnoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  codigoCertificado: String,
  tipoCertificado: String,
  estado: String,
  datosPersona: Object,
  datosCursoPrograma: Object,
  marcaId: String,
  fechaEmision: Date
});
const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);

async function migrate() {
  if (!MONGODB_URI) throw new Error('NO MONGODB_URI FOUND');
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado a MongoDB...');

  // 1. Migrar Productos desde Excel
  const excelGeomina = xlsx.readFile('GEOMINA AUTOMATIZACION CERTIFICADOS.xlsx');
  
  const modularesSheet = excelGeomina.Sheets['DATOS CERTIFICADOS MODULARES'];
  if (modularesSheet) {
    const dataModulares = xlsx.utils.sheet_to_json(modularesSheet);
    const programasUnicos = new Set();
    dataModulares.forEach(row => {
      const nombrePrograma = row['PROGRAMA'];
      if (nombrePrograma) programasUnicos.add(nombrePrograma);
    });

    console.log('Programas Geomina a migrar:', Array.from(programasUnicos));

    for (const prog of Array.from(programasUnicos)) {
      const slug = prog.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await Product.updateOne(
        { slug },
        { 
          $set: { 
            nombre: prog, 
            slug: slug, 
            marcaId: 'geomina', 
            tipoProducto: 'curso',
            estado: 'activo'
          }
        },
        { upsert: true }
      );
    }
  }

  // 2. Migrar Docentes
  const excelContratos = xlsx.readFile('AUTOMATIZACIÓN - CONTRATO - DOCENTES.xlsx');
  const docentesSheet = excelContratos.Sheets['DOCENTES DATOS'];
  if (docentesSheet) {
    const dataDocentes = xlsx.utils.sheet_to_json(docentesSheet);
    let totalDocentes = 0;
    
    // También agregar los programas de docentes a Product
    const progsDocentes = new Set();

    for (const row of dataDocentes) {
      const docente = row['DOCENTE'];
      const dni = row['DNI'];
      const programa = row['PROGRAMA'];

      if (!docente) continue;
      if (programa) progsDocentes.add(programa);

      let user = await User.findOne({ nombreCompleto: docente });
      if (!user) {
        user = await User.create({
          nombreCompleto: docente,
          nombres: docente,
          apellidos: '',
          email: `${dni || Math.random().toString(36).substring(7)}@docente.com`,
          password: '123',
          documento: dni || '',
          rol: 'docente'
        });
        totalDocentes++;
      }
    }

    for (const prog of Array.from(progsDocentes)) {
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
    console.log(`Migrados ${totalDocentes} docentes y sus programas CIIP.`);
  }

  console.log('Migración completada!');
  process.exit(0);
}

migrate().catch(console.error);
