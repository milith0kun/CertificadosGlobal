const xlsx = require('xlsx');
const excelContratos = xlsx.readFile('AUTOMATIZACIÓN - CONTRATO - DOCENTES.xlsx');
const docentesSheet = excelContratos.Sheets['DOCENTES DATOS'];
const dataDocentes = xlsx.utils.sheet_to_json(docentesSheet, { header: 1 });
const progsDocentes = new Set();
// dataDocentes[0] are headers, dataDocentes[i][3] is PROGRAMA
dataDocentes.forEach((row, i) => {
  if (i > 0 && row[3]) {
    progsDocentes.add(row[3]);
  }
});
console.log('Programas únicos encontrados en Excel:', Array.from(progsDocentes));
