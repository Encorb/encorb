const fs = require('fs');
const cp = require('child_process');

try {
  fs.rmSync('temp_docx', { recursive: true, force: true });
  fs.mkdirSync('temp_docx', { recursive: true });
  cp.execSync('tar -xf "Please refer.docx" -C temp_docx');
  const xml = fs.readFileSync('temp_docx/word/document.xml', 'utf8');
  // Match paragraphs
  const paragraphs = xml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];
  paragraphs.forEach(p => {
    const text = p.replace(/<[^>]+>/g, '').trim();
    if (text) console.log(text);
  });

  // Also check if there are media files
  if (fs.existsSync('temp_docx/word/media')) {
    console.log('Media files:', fs.readdirSync('temp_docx/word/media'));
  }
} catch (e) {
  console.error(e);
}
