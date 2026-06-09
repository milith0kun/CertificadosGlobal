const ID_PLANTILLA_PROGRAMAS = '10IKFEmsaG0wqLt_Thsm_JCDOFKjpyh5yndoeSaYVzvk';
const ID_PLANTILLA_TALLERES = '11qqyDknZolLptj7DoF7m7FssevNPJ8UBHIyFTas4gdE';
const ID_CARPETA_DESTINO = '1LnYfUDvT8y6pJMrxMP0bKF0Zy5o5XYcR'; 

function onOpen() {
  SpreadsheetApp.getUi().createMenu('📝 Gestión Académica')
    .addItem('Generar Nuevo Contrato PDF', 'mostrarPanel')
    .addToUi();
}

function mostrarPanel() {
  const html = HtmlService.createHtmlOutputFromFile('Panel')
    .setTitle('Generador Multi-Módulos')
    .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function configurarPermisoBorrado() {
  const hoja = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("eliminarFilaYArchivo")
    .forSpreadsheet(hoja)
    .onEdit()
    .create();
  SpreadsheetApp.getUi().alert("✅ Permiso de Drive configurado.");
}

function eliminarFilaYArchivo(e) {
  const hoja = e.source.getActiveSheet();
  const celda = e.range;
  if (hoja.getName() === "DOCENTES DATOS" && celda.getColumn() === 13 && e.value === "TRUE") {
    const fila = celda.getRow();
    const nombreDocente = hoja.getRange(fila, 1).getValue();
    const urlContrato = hoja.getRange(fila, 12).getValue(); 
    const ui = SpreadsheetApp.getUi();
    const respuesta = ui.alert('🚨 Confirmación', `¿Eliminar a "${nombreDocente}" y su PDF?`, ui.ButtonSet.YES_NO);

    if (respuesta == ui.Button.YES) {
      try {
        if (urlContrato) {
          const idArchivo = urlContrato.match(/[-\w]{25,}/);
          if (idArchivo) DriveApp.getFileById(idArchivo[0]).setTrashed(true);
        }
        hoja.deleteRow(fila);
      } catch (err) { hoja.deleteRow(fila); }
    } else { celda.setValue(false); }
  }
}

function obtenerDatosIniciales() {
  try {
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('DOCENTES DATOS');
    const datos = hoja.getDataRange().getValues();
    let res = { docentes: new Set(), programas: new Set(), modulos: new Set(), datosCompletos: {} };

    for (let i = 1; i < datos.length; i++) {
      const nombre = datos[i][0];
      if (nombre) {
        res.docentes.add(nombre);
        if (!res.datosCompletos[nombre]) res.datosCompletos[nombre] = { dni: "", domicilio: "" };
        if (datos[i][1]) res.datosCompletos[nombre].dni = datos[i][1];
        if (datos[i][2]) res.datosCompletos[nombre].domicilio = datos[i][2];
      }
      if (datos[i][3]) res.programas.add(datos[i][3]);
      if (datos[i][4]) res.modulos.add(datos[i][4]);
    }
    return {
      docentes: Array.from(res.docentes).sort(),
      programas: Array.from(res.programas).sort(),
      modulos: Array.from(res.modulos).sort(),
      mapeoDocentes: res.datosCompletos
    };
  } catch(e) { return "Error: " + e.message; }
}

function generarContratoPro(form) {
  try {
    const carpeta = DriveApp.getFolderById(ID_CARPETA_DESTINO);
    
    // SELECCIÓN DINÁMICA DE PLANTILLA BASADA EN EL PANEL HTML
    const idPlantilla = form.tipoContrato === 'Taller' ? ID_PLANTILLA_TALLERES : ID_PLANTILLA_PROGRAMAS;
    const plantilla = DriveApp.getFileById(idPlantilla);
    
    let nombreArchivo = form.modulos.length === 1 
      ? `Contrato_${form.docente}_${form.modulos[0].modulo}`
      : `Contrato_${form.docente}_MultiplesModulos`;

    const copiaDoc = plantilla.makeCopy(nombreArchivo, carpeta);
    const doc = DocumentApp.openById(copiaDoc.getId());
    const body = doc.getBody();

    // 1. MOTOR DE TABLAS DINÁMICAS (Soporta Módulo y Taller)
    const tables = body.getTables();
    for (let i = 0; i < tables.length; i++) {
      let table = tables[i];
      let templateRow = null;
      let templateIndex = -1;
      
      for (let r = 0; r < table.getNumRows(); r++) {
        const textoFila = table.getRow(r).getText();
        if (textoFila.includes('{{MODULO}}') || textoFila.includes('{{MÓDULO}}') || textoFila.includes('{{TALLER}}')) {
          templateRow = table.getRow(r);
          templateIndex = r;
          break;
        }
      }

      if (templateRow) {
        form.modulos.forEach(mod => {
          let newRow = table.insertTableRow(templateIndex, templateRow.copy());
          templateIndex++; 
          
          for (let c = 0; c < newRow.getNumCells(); c++) {
            let cell = newRow.getCell(c);
            cell.replaceText('(?i)\\{\\{\\s*PROGRAMA\\s*\\}\\}', mod.programa);
            cell.replaceText('(?i)\\{\\{\\s*M[OÓ]DULO\\s*\\}\\}', mod.modulo);
            cell.replaceText('(?i)\\{\\{\\s*TALLER\\s*\\}\\}', mod.modulo); // Reemplaza tag de taller
            cell.replaceText('(?i)\\{\\{\\s*DOCENTE\\s*\\}\\}', form.docente);
            cell.replaceText('(?i)\\{\\{\\s*FECHAS HORARIO\\s*\\}\\}', mod.fechas);
            cell.replaceText('(?i)\\{\\{\\s*HORA\\s*\\}\\}', mod.horaAmPm);
            cell.replaceText('(?i)\\{\\{\\s*HORAS CRONOL[OÓ]GICAS\\s*\\}\\}', mod.horas);
            cell.replaceText('(?i)\\{\\{\\s*HONORARIO\\s*\\}\\}', `${form.moneda} ${mod.honorario}`);
            cell.replaceText('(?i)[$|S/]?\\s*\\{\\{\\s*REMUN[EA]RACI[OÓ]N\\s*\\}\\}', `${form.moneda} ${mod.remuneracion}`);
          }
        });
        table.removeRow(templateIndex); 
      }
    }

    // 2. REEMPLAZOS GLOBALES (Párrafos fuera de las tablas)
    const regexLimpio = (tag) => `(?i)[$|S/]?\\s*\\{\\{\\s*${tag}\\s*\\}\\}`;
    
    body.replaceText(regexLimpio('DOCENTE'), form.docente);
    body.replaceText(regexLimpio('Doc idenT'), form.tipoDoc);
    body.replaceText(regexLimpio('DNI DOCENTE'), form.dni);
    body.replaceText(regexLimpio('DOMICILIO DOCENTE'), form.domicilio);
    body.replaceText(regexLimpio('FECHA'), form.fechaEmision);

    const totalRemuneracion = form.modulos.reduce((sum, m) => sum + parseFloat(m.remuneracion), 0).toFixed(2);
    const nombresModulos = form.modulos.map(m => m.modulo).join(", ");
    const nombresProgramas = Array.from(new Set(form.modulos.map(m => m.programa))).join(", ");

    body.replaceText(regexLimpio('PROGRAMA'), nombresProgramas);
    body.replaceText('(?i)\\{\\{\\s*M[OÓ]DULO\\s*\\}\\}', nombresModulos);
    body.replaceText('(?i)\\{\\{\\s*TALLER\\s*\\}\\}', nombresModulos); // Reemplaza tag de taller
    body.replaceText('(?i)[$|S/]?\\s*\\{\\{\\s*REMUN[EA]RACI[OÓ]N\\s*\\}\\}', `${form.moneda} ${totalRemuneracion}`);
    
    const honorariosUnicos = Array.from(new Set(form.modulos.map(m => m.honorario)));
    const textoHonorario = honorariosUnicos.length === 1 
      ? `${form.moneda} ${honorariosUnicos[0]}` 
      : honorariosUnicos.map(h => `${form.moneda} ${h}`).join(" y ");
    
    body.replaceText(regexLimpio('HONORARIO'), textoHonorario);

    body.replaceText(regexLimpio('FECHAS HORARIO'), "Según detalle del cuadro");
    body.replaceText(regexLimpio('HORA'), "Según detalle del cuadro");
    body.replaceText('(?i)\\{\\{\\s*HORAS CRONOL[OÓ]GICAS\\s*\\}\\}', "Según detalle del cuadro");

    doc.saveAndClose();

    // 3. GENERAR PDF
    const pdfFile = carpeta.createFile(copiaDoc.getAs(MimeType.PDF)).setName(nombreArchivo + ".pdf");
    copiaDoc.setTrashed(true); 
    const urlPdf = pdfFile.getUrl();

    // 4. GUARDAR EN EXCEL
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('DOCENTES DATOS');
    hoja.getRange("B:B").setNumberFormat("@"); 
    
    const valoresA = hoja.getRange("A:A").getValues();
    let fila = 1;
    for (let i = 0; i < valoresA.length; i++) { if (valoresA[i][0] === "") { fila = i + 1; break; } }
    if (fila === 1) fila = valoresA.length + 1;

    let filasNuevas = [];
    form.modulos.forEach(mod => {
      filasNuevas.push([
        form.docente, form.dni, form.domicilio, mod.programa, mod.modulo,
        form.fechaRealHoy, mod.fechas, mod.horaAmPm, mod.horas,
        `${form.moneda} ${mod.remuneracion}`, 
        `${form.moneda} ${mod.honorario}`, 
        urlPdf, false
      ]);
    });
    
    hoja.getRange(fila, 1, filasNuevas.length, 13).setValues(filasNuevas);

    return urlPdf;
  } catch (e) { return "Error: " + e.message; }
}
