import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

/**
 * Genera un PDF a partir de una imagen de fondo (PNG/JPG)
 * y le dibuja texto, firmas e imágenes (como el QR).
 * 
 * @param {Buffer|Uint8Array} bgImageBytes Los bytes de la imagen de fondo limpia.
 * @param {Array} textElements Arreglo con textos a dibujar: [{ text: "Juan", x: 100, y: 500, size: 24, font: 'Helvetica-Bold', color: '#000' }]
 * @param {Array} imageElements Arreglo con imágenes (firmas, QR): [{ imageBytes: Buffer, x: 200, y: 150, width: 100, height: 100 }]
 */
export async function generatePdfFromImage(bgImageBytes, textElements = [], imageElements = []) {
  // Crear un nuevo documento PDF
  const pdfDoc = await PDFDocument.create();

  // Incrustar la imagen de fondo
  const bgImage = await pdfDoc.embedPng(bgImageBytes); // Asumimos PNG para los fondos
  const { width, height } = bgImage.scale(1); // Tamaño original de la imagen

  // Crear una página del mismo tamaño que la imagen de fondo
  const page = pdfDoc.addPage([width, height]);

  // Dibujar el fondo ocupando toda la página
  page.drawImage(bgImage, {
    x: 0,
    y: 0,
    width,
    height,
  });

  // Cargar fuentes estándar
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helper para parsear color Hex a RGB de pdf-lib
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#000000');
    return result ? rgb(
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ) : rgb(0, 0, 0);
  };

  // Dibujar los Textos
  for (const el of textElements) {
    if (!el.text) continue;
    const font = el.isBold ? fontBold : fontRegular;
    
    // Centrar texto si se requiere (calculando el ancho del texto)
    let xPos = el.x;
    if (el.center) {
      const textWidth = font.widthOfTextAtSize(el.text, el.size || 16);
      xPos = (width / 2) - (textWidth / 2);
    }

    page.drawText(el.text, {
      x: xPos,
      y: el.y, // Importante: en pdf-lib, y=0 está abajo a la izquierda. Hay que invertir coordenadas si es necesario.
      size: el.size || 16,
      font: font,
      color: hexToRgb(el.color),
    });
  }

  // Dibujar Imágenes Extras (Firmas, QR)
  for (const img of imageElements) {
    if (!img.imageBytes) continue;
    try {
      let embeddedImage;
      // Intenta embeber PNG o JPG según sea el caso
      try {
        embeddedImage = await pdfDoc.embedPng(img.imageBytes);
      } catch (e) {
        embeddedImage = await pdfDoc.embedJpg(img.imageBytes);
      }
      
      page.drawImage(embeddedImage, {
        x: img.x,
        y: img.y,
        width: img.width,
        height: img.height,
      });
    } catch (err) {
      console.error("Error dibujando imagen extra:", err);
    }
  }

  // Guardar y retornar los bytes del PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Genera el buffer de un código QR.
 */
export async function generateQRBuffer(url) {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      color: { dark: '#0c2844', light: '#ffffff' }
    });
    // Convertir Data URL a Buffer
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    return Buffer.from(base64Data, 'base64');
  } catch (err) {
    console.error("Error generando QR:", err);
    return null;
  }
}
