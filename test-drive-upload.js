import { drive } from './src/lib/google.js';
import { Readable } from 'stream';

async function test() {
  try {
    const buffer = Buffer.from('Hello PDF');
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const res = await drive.files.create({
      requestBody: {
        name: 'test.pdf',
        parents: ['1yHUepgZklBvh121CP07zKTp0qXdKNN8v'], // The folder the user used before
        mimeType: 'application/pdf'
      },
      media: {
        mimeType: 'application/pdf',
        body: stream
      }
    });

    const fileId = res.data.id;
    console.log('Uploaded ID:', fileId);

    // Make it public
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    const file = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink'
    });

    console.log('Public Links:', file.data);
  } catch (err) {
    console.error(err);
  }
}
test();
