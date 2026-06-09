import { drive, slides, docs } from './google.js';

export async function generarCertificadoGoogle(datos, templateId, destinationFolderId, nombreArchivo) {
  try {
    // 1. Clonar la plantilla
    console.log(`Clonando plantilla ${templateId}...`);
    const copyRes = await drive.files.copy({
      fileId: templateId,
      requestBody: {
        name: nombreArchivo,
        parents: [destinationFolderId],
      },
    });
    
    const newFileId = copyRes.data.id;
    
    // 2. Preparar los reemplazos de texto
    const requests = [];
    for (const [key, value] of Object.entries(datos)) {
      requests.push({
        replaceAllText: {
          containsText: { text: `{{${key}}}`, matchCase: false },
          replaceText: value.toString(),
        },
      });
      // También probamos con espacios por si acaso (ej. {{ NOMBRE }})
      requests.push({
        replaceAllText: {
          containsText: { text: `{{ ${key} }}`, matchCase: false },
          replaceText: value.toString(),
        },
      });

      // Si la clave es QR, insertamos la imagen en el shape correspondiente
      if (key === 'QR') {
        const qrImageUrl = `https://certificaciones.ecosdelseo.com/api/public/qr?url=${encodeURIComponent(value)}`;
        requests.push({
          replaceAllShapesWithImage: {
            imageUrl: qrImageUrl,
            replaceMethod: 'CENTER_INSIDE',
            containsText: {
              text: '{{QR}}',
              matchCase: false
            }
          }
        });
        requests.push({
          replaceAllShapesWithImage: {
            imageUrl: qrImageUrl,
            replaceMethod: 'CENTER_INSIDE',
            containsText: {
              text: '{{ QR }}',
              matchCase: false
            }
          }
        });
      }
    }

    // 3. Ejecutar reemplazo en Google Slides
    console.log(`Reemplazando textos en ${newFileId}...`);
    await slides.presentations.batchUpdate({
      presentationId: newFileId,
      requestBody: { requests },
    });

    // 4. (Opcional) Aquí agregaremos luego el reemplazo de imágenes para firmas

    // 5. Exportar como PDF
    console.log(`Exportando a PDF...`);
    // Esperamos 2 segundos para asegurar que Google guardó los cambios
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pdfRes = await drive.files.export(
      { fileId: newFileId, mimeType: 'application/pdf' },
      { responseType: 'stream' }
    );
    
    const chunks = [];
    for await (const chunk of pdfRes.data) chunks.push(chunk);
    const pdfBuffer = Buffer.concat(chunks);
    
    console.log('PDF generado exitosamente en memoria.');

    // 6. Eliminar el archivo temporal de Slides
    await drive.files.delete({ fileId: newFileId });

    return pdfBuffer;
  } catch (error) {
    console.error('Error en generarCertificadoGoogle:', error);
    throw error;
  }
}
