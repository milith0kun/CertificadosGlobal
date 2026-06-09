import { drive } from './src/lib/google.js';

async function listSubFolders() {
  try {
    const folders = ['18dwY2nkoUfXKJMa4FQ1wk9eo1krD6_kB', '1Di0uxQxFw0pxBQCBd3k_2ql_SJJ67gP1', '1nMFJ4QYlXP7lDkhUL-y9Z82_m8Xa8ufk', '1n7mhvI_yMuy0e8BmK7byWbLIyiTvSs9M'];
    for (const folderId of folders) {
      console.log(`\n📁 Buscando en carpeta ID: ${folderId}`);
      const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
        spaces: 'drive',
      });
      res.data.files.forEach(f => console.log(`  - [${f.mimeType}] ${f.name}`));
    }
  } catch (err) {
    console.error('❌ ERROR:', err.message);
  }
}

listSubFolders();
