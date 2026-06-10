import { drive, slides } from './google.js';
import { generateQRBuffer } from './qr-generator.js';

async function uploadTemporaryQr(validationUrl, destinationFolderId) {
  const qrBuffer = await generateQRBuffer(validationUrl);
  if (!qrBuffer) {
    throw new Error('No se pudo generar la imagen QR');
  }

  const { PassThrough } = await import('stream');
  const bufferStream = new PassThrough();
  bufferStream.end(qrBuffer);

  const uploadRes = await drive.files.create({
    requestBody: {
      name: `QR_TEMP_${Date.now()}.png`,
      parents: [destinationFolderId],
      mimeType: 'image/png',
    },
    media: {
      mimeType: 'image/png',
      body: bufferStream,
    },
  });

  const fileId = uploadRes.data.id;
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return {
    fileId,
    imageUrl: `https://drive.usercontent.google.com/download?id=${fileId}&export=download`,
  };
}

export async function generarCertificadoGoogle(
  datos,
  templateId,
  destinationFolderId,
  nombreArchivo,
  { qrImageObjectId = null } = {}
) {
  let newFileId = null;
  let temporaryQrFileId = null;

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
    
    newFileId = copyRes.data.id;
    
    // 2. Preparar los reemplazos de texto
    const requests = [];
    for (const [key, value] of Object.entries(datos)) {
      if (key === 'QR') {
        const temporaryQr = await uploadTemporaryQr(value, destinationFolderId);
        temporaryQrFileId = temporaryQr.fileId;
        const qrImageUrl = temporaryQr.imageUrl;

        // Algunas plantillas antiguas tienen un QR fijo en lugar de {{QR}}.
        if (qrImageObjectId) {
          requests.push({
            replaceImage: {
              imageObjectId: qrImageObjectId,
              url: qrImageUrl,
              imageReplaceMethod: 'CENTER_INSIDE',
            },
          });
        }

        for (const marker of ['{{QR}}', '{{ QR }}']) {
          requests.push({
            replaceAllShapesWithImage: {
              imageUrl: qrImageUrl,
              imageReplaceMethod: 'CENTER_INSIDE',
              containsText: {
                text: marker,
                matchCase: false,
              },
            },
          });
        }

        continue;
      }

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
    }

    // 3. Ejecutar reemplazo en Google Slides
    console.log(`Reemplazando textos en ${newFileId}...`);
    await slides.presentations.batchUpdate({
      presentationId: newFileId,
      requestBody: { requests },
    });

    // Slides ya copió la imagen dentro de la presentación.
    if (temporaryQrFileId) {
      await drive.files.delete({ fileId: temporaryQrFileId });
      temporaryQrFileId = null;
    }

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

    // 6. Subir el PDF a Google Drive para que sea público
    const { PassThrough } = await import('stream');
    const bufferStream = new PassThrough();
    bufferStream.end(pdfBuffer);

    const uploadRes = await drive.files.create({
      requestBody: {
        name: `${nombreArchivo}.pdf`,
        parents: [destinationFolderId],
        mimeType: 'application/pdf'
      },
      media: {
        mimeType: 'application/pdf',
        body: bufferStream
      }
    });

    const finalPdfId = uploadRes.data.id;

    // Hacerlo público
    await drive.permissions.create({
      fileId: finalPdfId,
      requestBody: { role: 'reader', type: 'anyone' }
    });

    const fileMeta = await drive.files.get({
      fileId: finalPdfId,
      fields: 'webViewLink'
    });

    const pdfUrl = fileMeta.data.webViewLink;
    console.log('PDF Público en:', pdfUrl);

    // 7. Eliminar el archivo temporal de Slides
    await drive.files.delete({ fileId: newFileId });
    newFileId = null;

    return { buffer: pdfBuffer, pdfUrl };
  } catch (error) {
    console.error('Error en generarCertificadoGoogle:', error);
    throw error;
  } finally {
    if (temporaryQrFileId) {
      await drive.files.delete({ fileId: temporaryQrFileId }).catch(() => {});
    }
    if (newFileId) {
      await drive.files.delete({ fileId: newFileId }).catch(() => {});
    }
  }
}
