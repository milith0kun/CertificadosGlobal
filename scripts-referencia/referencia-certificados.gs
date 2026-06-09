function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 CIIP LATAM') 
    .addItem('🎓 Generar Certificados GENERALES', 'generarGenerales')
    .addItem('📄 Generar Certificados MODULARES', 'generarModulares')
    .addSeparator()
    .addItem('⚙️ Configurar Carpeta Destino Manual', 'configurarCarpeta')
    .addToUi();
}

function generarGenerales() { ejecutarGeneracion('GENERAL'); }
function generarModulares() { ejecutarGeneracion('MODULAR'); }

function configurarCarpeta() {
  const ui = SpreadsheetApp.getUi();
  const scriptProperties = PropertiesService.getDocumentProperties();
  const respuesta = ui.prompt('⚙️ Configuración de Destino', 'Pega el enlace o el ID de la carpeta de Drive:', ui.ButtonSet.OK_CANCEL);

  if (respuesta.getSelectedButton() === ui.Button.OK) {
    let folderId = respuesta.getResponseText().trim();
    if (folderId.includes('drive.google.com')) {
      const match = folderId.match(/[-\w]{25,}/);
      if (match) folderId = match[0];
    }
    try {
      DriveApp.getFolderById(folderId); 
      scriptProperties.setProperty('ROOT_FOLDER_ID', folderId);
      ui.alert('✅ Configuración Guardada', 'La carpeta destino ha sido actualizada.', ui.ButtonSet.OK);
    } catch (e) {
      ui.alert('❌ Error', 'El enlace no es válido o no tienes permisos.', ui.ButtonSet.OK);
    }
  }
}

function ejecutarGeneracion(tipoCertificado) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const scriptProperties = PropertiesService.getDocumentProperties();
  let rootFolderId = scriptProperties.getProperty('ROOT_FOLDER_ID') || '1SHqufkVfu3cvzvDSpvqjmE5SqgiYBpqv';

  // --- 1. PESTAÑA ALUMNOS ---
  const respuestaHoja = ui.prompt(`🚀 Generando Certificados ${tipoCertificado}ES`, '1. Escribe el nombre de la pestaña (ejemplo: INICIO 1):', ui.ButtonSet.OK_CANCEL);
  if (respuestaHoja.getSelectedButton() !== ui.Button.OK) return;
  const nombreHoja = respuestaHoja.getResponseText().trim();
  const hojaAlumnos = ss.getSheetByName(nombreHoja);
  if (!hojaAlumnos) return ui.alert('❌ Error', `No se encontró la pestaña "${nombreHoja}". Verifica que el nombre esté bien escrito.`, ui.ButtonSet.OK);

  const lastColAlumnos = hojaAlumnos.getLastColumn();
  const lastRowAlumnos = hojaAlumnos.getLastRow();
  if (lastRowAlumnos < 1 || lastColAlumnos < 1) {
    return ui.alert('❌ Error de Datos', `La pestaña "${nombreHoja}" está completamente vacía. Agrega al menos los encabezados y un estudiante.`, ui.ButtonSet.OK);
  }

  // --- 2. CARPETA DESTINO ---
  const respuestaCarpeta = ui.prompt('📁 Seleccionar Carpeta', '2. Pega el ENLACE de la carpeta destino.\n(Deja en blanco para usar la última guardada)', ui.ButtonSet.OK_CANCEL);
  if (respuestaCarpeta.getSelectedButton() !== ui.Button.OK) return;
  
  let folderInput = respuestaCarpeta.getResponseText().trim();
  if (folderInput !== '') {
    if (folderInput.includes('drive.google.com')) {
      const match = folderInput.match(/[-\w]{25,}/);
      if (match) rootFolderId = match[0];
    } else { rootFolderId = folderInput; }
    scriptProperties.setProperty('ROOT_FOLDER_ID', rootFolderId);
  }

  try { 
    DriveApp.getFolderById(rootFolderId); 
  } catch (e) { 
    return ui.alert('❌ Error', 'La carpeta destino no es válida o no tienes permisos.', ui.ButtonSet.OK); 
  }

  // --- 3. CONFIGURACIÓN DE DATOS ---
  let nombreHojaDatos = tipoCertificado === 'GENERAL' ? 'DATOS CERTIFICADO GENERAL' : 'DATOS CERTIFICADOS MODULARES';
  
  // IDs ACTUALIZADOS: El primero es el nuevo que proporcionaste para GENERAL
  let templateId = tipoCertificado === 'GENERAL' ? '1YJiolK2rZS6X-qxMfoBaPkddk_b-c7wsVI8ymOedpys' : '1pHAmTXr7QZCRWDlC4SC5P_nbagmKr6bu7SViKdDxYvc';
  
  let prefijoArchivo = tipoCertificado === 'GENERAL' ? 'GEN_' : 'MOD_';

  const hojaGeneral = ss.getSheetByName(nombreHojaDatos);
  if (!hojaGeneral) return ui.alert('❌ Error', `Falta la pestaña "${nombreHojaDatos}".`, ui.ButtonSet.OK);

  const lastColGen = hojaGeneral.getLastColumn();
  const lastRowGen = hojaGeneral.getLastRow();
  if (lastRowGen < 2 || lastColGen < 1) {
    return ui.alert('❌ Error de Datos', `La hoja "${nombreHojaDatos}" no tiene datos suficientes.`, ui.ButtonSet.OK);
  }

  const headersGen = hojaGeneral.getRange(1, 1, 1, lastColGen).getValues()[0].map(h => h.toString().replace(/_/g, ' ').trim());
  const displayValGenAll = hojaGeneral.getRange(2, 1, lastRowGen - 1, lastColGen).getDisplayValues();
  const richTextGenAll = hojaGeneral.getRange(2, 1, lastRowGen - 1, lastColGen).getRichTextValues();

  let indexPrograma = headersGen.indexOf('PROGRAMA');
  const nombrePrograma = (displayValGenAll[0][indexPrograma] || 'Programa Sin Nombre').toString().trim();

  // --- 4. CREACIÓN DE CARPETAS BASE ---
  const rootFolder = DriveApp.getFolderById(rootFolderId);
  const programaFolder = getOrCreateSubFolder(rootFolder, nombrePrograma);
  const inicioFolder = getOrCreateSubFolder(programaFolder, nombreHoja);

  const displayValAlumnos = hojaAlumnos.getRange(1, 1, lastRowAlumnos, lastColAlumnos).getDisplayValues();
  const richTextAlumnos = hojaAlumnos.getRange(1, 1, lastRowAlumnos, lastColAlumnos).getRichTextValues();
  const headersAlumnos = displayValAlumnos[0].map(h => h.toString().replace(/_/g, ' ').trim());
  
  ss.toast(`Iniciando generación...`, '⏳ Organizando...', 5);

  const esColumnaImagen = (nombre) => {
    const n = nombre.toUpperCase().trim();
    if (n.includes('FECHA')) return false; 
    return n.includes('AVAL') || n.includes('SELLO') || n.includes('FIRMA') || n.includes('1RA') || n.includes('2DA') || n.includes('QR');
  };

  let procesados = 0;
  let errores = 0;
  const columnasEstudiantePermitidas = ['NOMBRE', 'REGISTRO', 'TOMO', 'FOLIO', 'QR'];

  for (let i = 1; i < displayValAlumnos.length; i++) {
    const rowDisplay = displayValAlumnos[i];
    const rowRich = richTextAlumnos[i];
    const nombreParticipante = rowDisplay[headersAlumnos.indexOf('NOMBRE')];
    if (!nombreParticipante || nombreParticipante.toString().trim() === '') continue;
    
    procesados++;
    const estudianteFolder = getOrCreateSubFolder(inicioFolder, nombreParticipante);
    const iniciales = nombreParticipante.split(' ').filter(p => p.length > 0).map(p => p[0].toUpperCase()).join('');
    
    for (let c = 0; c < displayValGenAll.length; c++) {
      let filaConfigDisplay = displayValGenAll[c];
      let filaConfigRich = richTextGenAll[c];
      if (!filaConfigDisplay.join('').trim()) continue; 

      let nombreFinalArchivo = tipoCertificado === 'GENERAL' ? `${prefijoArchivo}${iniciales}` : `${prefijoArchivo}${c + 1}_${iniciales}`;
      ss.toast(`Generando: ${nombreParticipante} (${nombreFinalArchivo})`, '⏳ Creando PDF...', -1);
      SpreadsheetApp.flush(); 

      try {
        let datosGeneralesActual = {};
        let richGeneralesActual = {};
        for (let h = 0; h < headersGen.length; h++) {
          let link = filaConfigRich[h] ? filaConfigRich[h].getLinkUrl() : null;
          datosGeneralesActual[headersGen[h]] = link ? link : filaConfigDisplay[h];
          richGeneralesActual[headersGen[h]] = filaConfigRich[h]; 
        }

        let pdfGenerado = false;
        let intentos = 0;
        let copy;

        while (!pdfGenerado && intentos < 3) {
          intentos++;
          try {
            copy = DriveApp.getFileById(templateId).makeCopy(nombreFinalArchivo, estudianteFolder);
            Utilities.sleep(1000); 

            const presentation = SlidesApp.openById(copy.getId());
            const slides = presentation.getSlides();

            // -- REEMPLAZOS GENERALES --
            Object.keys(datosGeneralesActual).forEach(key => {
              if (!esColumnaImagen(key)) {
                if (key.toUpperCase() === 'MODULO TEMA') {
                   aplicarFormatoEnriquecido(slides, 'MODULO TEMA', richGeneralesActual[key]);
                } else {
                  let valor = (datosGeneralesActual[key] || '').toString().trim();
                  let kSpace = key.toUpperCase();
                  let kScore = kSpace.replace(/ /g, '_');
                  presentation.replaceAllText('{{' + kSpace + '}}', valor.toUpperCase(), true);
                  presentation.replaceAllText('{{' + kScore + '}}', valor.toUpperCase(), true);
                  presentation.replaceAllText('{{' + toTitleCase(key) + '}}', toTitleCase(valor), true);
                  presentation.replaceAllText('{{' + key.toLowerCase() + '}}', valor.toLowerCase(), true);
                }
              }
            });
            
            // -- REEMPLAZOS ALUMNOS --
            headersAlumnos.forEach((header, index) => {
              if (!esColumnaImagen(header)) {
                if (tipoCertificado === 'MODULAR' && !columnasEstudiantePermitidas.includes(header.toUpperCase())) return; 
                let valor = (rowDisplay[index] || '').toString().trim();
                let hSpace = header.toUpperCase();
                let hScore = hSpace.replace(/ /g, '_');
                presentation.replaceAllText('{{' + hSpace + '}}', valor.toUpperCase(), true);
                presentation.replaceAllText('{{' + hScore + '}}', valor.toUpperCase(), true);
                presentation.replaceAllText('{{' + toTitleCase(header) + '}}', toTitleCase(valor), true);
                presentation.replaceAllText('{{' + header.toLowerCase() + '}}', valor.toLowerCase(), true);
              }
            });

            // -- REEMPLAZOS IMÁGENES --
            slides.forEach(slide => {
              slide.getShapes().slice().reverse().forEach(shape => {
                const textRange = shape.getText();
                if (textRange) {
                  const textStringUpper = textRange.asString().trim().toUpperCase().replace(/_/g, ' '); 
                  const todasLasColumnas = [...headersGen, ...headersAlumnos];
                  todasLasColumnas.forEach(colName => {
                    if (esColumnaImagen(colName)) {
                      if (tipoCertificado === 'MODULAR' && headersAlumnos.includes(colName) && !columnasEstudiantePermitidas.includes(colName.toUpperCase())) return; 
                      const marcador = `{{${colName.toUpperCase().replace(/_/g, ' ')}}}`;
                      if (textStringUpper === marcador) {
                        let urlImagen = datosGeneralesActual[colName];
                        if (!urlImagen) {
                          const idx = headersAlumnos.indexOf(colName);
                          if (idx !== -1) {
                            urlImagen = rowRich[idx] && rowRich[idx].getLinkUrl() ? rowRich[idx].getLinkUrl() : rowDisplay[idx];
                          }
                        }
                        if (urlImagen) {
                          try {
                            slide.insertImage(fetchImageBlob(urlImagen), shape.getLeft(), shape.getTop(), shape.getWidth(), shape.getHeight());
                            shape.remove(); 
                          } catch (e) { shape.getText().setText(''); }
                        } else { shape.getText().setText(''); }
                      }
                    }
                  });
                }
              });
            });

            presentation.saveAndClose();
            Utilities.sleep(2500); 

            const pdfBlob = copy.getAs(MimeType.PDF).setName(nombreFinalArchivo + ".pdf");
            estudianteFolder.createFile(pdfBlob);
            copy.setTrashed(true); 

            pdfGenerado = true; 
            
          } catch (errorIntento) {
            if (copy) { try { copy.setTrashed(true); } catch(e){} }
            if (intentos >= 3) { throw errorIntento; }
            Utilities.sleep(3000); 
            ss.toast(`Reintentando certificado para ${nombreParticipante} (Intento ${intentos + 1}/3)...`, '⚠️ Reintento', 3);
          }
        }

      } catch (err) {
        Logger.log(`Error crítico al generar para ${nombreParticipante}: ${err}`);
        errores++;
      }

      if (tipoCertificado === 'GENERAL') break;
    }
  }
  
  if (errores > 0) {
    ui.alert('⚠️ Terminado con Avisos', `Se procesaron ${procesados} alumnos, pero ocurrieron ${errores} errores en el camino.`, ui.ButtonSet.OK);
  } else if (procesados > 0) {
    ui.alert('✅ Terminado', `Proceso completado con éxito para ${procesados} estudiantes.`, ui.ButtonSet.OK);
  } else {
    ui.alert('⚠️ Aviso', 'No se encontraron alumnos para procesar.', ui.ButtonSet.OK);
  }
}

function aplicarFormatoEnriquecido(slides, marcadorDeseado, richTextValue) {
  if (!richTextValue) return;
  slides.forEach(slide => {
    slide.getShapes().forEach(shape => procesarRangoTextoParaEnriquecido(shape.getText(), marcadorDeseado, richTextValue));
    slide.getTables().forEach(table => {
      for (let r = 0; r < table.getNumRows(); r++) {
        for (let c = 0; c < table.getNumColumns(); c++) {
           procesarRangoTextoParaEnriquecido(table.getCell(r, c).getText(), marcadorDeseado, richTextValue);
        }
      }
    });
  });
}

function procesarRangoTextoParaEnriquecido(textRange, marcadorDeseado, richTextValue) {
  if (!textRange) return;
  let textString = textRange.asString().trim().toUpperCase().replace(/_/g, ' ');
  let marcador = `{{${marcadorDeseado.toUpperCase()}}}`;

  if (textString === marcador) {
    textRange.setText(''); 
    const runs = richTextValue.getRuns();
    for (let i = 0; i < runs.length; i++) {
      const run = runs[i];
      const runText = run.getText();
      if (runText === '') continue;

      const appendedRange = textRange.appendText(runText);
      const style = run.getTextStyle();
      const appendedStyle = appendedRange.getTextStyle();

      appendedStyle.setBold(style.isBold() === true);
      appendedStyle.setItalic(style.isItalic() === true);
      appendedStyle.setUnderline(style.isUnderline() === true);

      const hexColor = obtenerHexSeguro(style);
      
      if (hexColor && hexColor !== '#000000') {
        appendedStyle.setForegroundColor(hexColor);
      } else {
        appendedStyle.setForegroundColor('#000000'); 
      }
    }
  }
}

function obtenerHexSeguro(style) {
  try {
    let hex = style.getForegroundColor();
    if (hex && typeof hex === 'string' && hex.startsWith('#')) return hex;
  } catch(e) {}
  try {
    const colorObj = style.getForegroundColorObject();
    if (colorObj) {
      if (colorObj.getColorType() === SpreadsheetApp.ColorType.RGB) return colorObj.asRgbColor().asHexString();
      else if (colorObj.getColorType() === SpreadsheetApp.ColorType.THEME) {
        const theme = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTheme();
        const themeType = colorObj.asThemeColor().getThemeColorType();
        if (theme && themeType) {
          const rgbObj = theme.getThemeColor(themeType);
          if (rgbObj && rgbObj.getColorType() === SpreadsheetApp.ColorType.RGB) return rgbObj.asRgbColor().asHexString();
        }
      }
    }
  } catch (e) {}
  return null; 
}

function getOrCreateSubFolder(parentFolder, folderName) {
  const folders = parentFolder.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : parentFolder.createFolder(folderName);
}

function fetchImageBlob(url) {
  if (url.includes('drive.google.com')) {
    const match = url.match(/[-\w]{25,}/);
    if (match) return DriveApp.getFileById(match[0]).getBlob();
  }
  return UrlFetchApp.fetch(url).getBlob();
}

function toTitleCase(str) {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
