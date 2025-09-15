import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const PARTIALS_DIR = path.join(ROOT, 'partials');

async function read(filePath) {
  return fs.readFile(filePath, 'utf8');
}

async function write(filePath, content) {
  await fs.writeFile(filePath, content, 'utf8');
}

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) continue; // flat dist
    if (e.isFile() && e.name.toLowerCase().endsWith('.html')) files.push(full);
  }
  return files;
}

function replaceSection(html, startRegex, replacement) {
  return html.replace(startRegex, replacement);
}

async function main() {
  const headerPath = path.join(PARTIALS_DIR, 'header.html');
  const footerPath = path.join(PARTIALS_DIR, 'footer.html');
  const [header, footer] = await Promise.all([read(headerPath), read(footerPath)]);

  const files = await listHtmlFiles(DIST_DIR);
  const navRe = /<nav\s+class="main-nav"[\s\S]*?<\/nav>/i;
  const footerRe = /<footer[\s\S]*?<\/footer>/i;

  for (const file of files) {
    let html = await read(file);
    const orig = html;

    html = replaceSection(html, navRe, header);
    html = replaceSection(html, footerRe, footer);

    if (html !== orig) {
      await write(file, html);
      console.log('Inlined partials into', path.basename(file));
    } else {
      console.log('No changes for', path.basename(file));
    }
  }
}

main().catch((err) => {
  console.error('inline-partials failed:', err);
  process.exit(1);
});


