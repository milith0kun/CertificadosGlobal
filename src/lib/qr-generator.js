import QRCode from 'qrcode';

export async function generateQRDataUrl(text) {
  try {
    return await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0c2844',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return null;
  }
}

export async function generateQRBuffer(text) {
  try {
    return await QRCode.toBuffer(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0c2844',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Error generating QR buffer:', err);
    return null;
  }
}
