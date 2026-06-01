// Trim white background from logo.jpg and save as logo-clean.png
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const input = join(publicDir, 'logo.jpg');
const output = join(publicDir, 'logo-clean.png');

await sharp(input)
  .flatten({ background: '#ffffff' })
  .trim({ background: '#ffffff', threshold: 10 })
  .png({ quality: 95 })
  .toFile(output);

console.log('Logo trimmed → public/logo-clean.png');
