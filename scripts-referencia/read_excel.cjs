const xlsx = require('xlsx');

const file1 = 'AUTOMATIZACIÓN - CONTRATO - DOCENTES.xlsx';
const file2 = 'GEOMINA AUTOMATIZACION CERTIFICADOS.xlsx';

function inspectExcel(filename) {
  console.log(`\n=== Inspeccionando: ${filename} ===`);
  try {
    const workbook = xlsx.readFile(filename);
    const sheetNames = workbook.SheetNames;
    console.log(`Pestañas encontradas: ${sheetNames.join(', ')}`);

    sheetNames.forEach(sheetName => {
      console.log(`\n--- Pestaña: ${sheetName} ---`);
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (data.length === 0) {
        console.log("Pestaña vacía.");
        return;
      }
      
      // Mostrar encabezados (suponiendo que la fila 0 o 1 son encabezados)
      console.log("Encabezados:", data[0]);
      
      // Mostrar primeras 2 filas de datos para ver la estructura
      console.log("Fila 1 de datos:", data[1] || "N/A");
      console.log("Fila 2 de datos:", data[2] || "N/A");
    });
  } catch (error) {
    console.error(`Error leyendo ${filename}:`, error.message);
  }
}

inspectExcel(file1);
inspectExcel(file2);
