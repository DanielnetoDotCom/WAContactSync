import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const folders = ['frontend', 'backend'];
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.yml', '.sql'];
const outputFile = path.join(__dirname, 'js-files.txt');

const output = [];

function scanDir(dirPath) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item === 'node_modules') continue;
      scanDir(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      const relativePath = path.relative(__dirname, fullPath);
      const content = fs.readFileSync(fullPath, 'utf-8');

      output.push(`--- FILE: ${relativePath} ---\n${content}\n`);
    }
  }
}

folders.forEach(folder => {
  const fullPath = path.join(__dirname, folder);
  if (fs.existsSync(fullPath)) {
    scanDir(fullPath);
  } else {
    console.warn(`Folder not found: ${folder}`);
  }
});

fs.writeFileSync(outputFile, output.join('\n'), 'utf-8');
console.log(`js-files.txt created with ${output.length} files.`);
