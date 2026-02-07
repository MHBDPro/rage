#!/usr/bin/env node
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const logoPath = join(publicDir, 'logo.jpg');

const sizes = [
  { name: 'logo-192.png', width: 192, height: 192 },
  { name: 'logo-512.png', width: 512, height: 512 },
  { name: 'apple-touch-icon.png', width: 180, height: 180 },
  { name: 'favicon-32x32.png', width: 32, height: 32 },
  { name: 'favicon-16x16.png', width: 16, height: 16 },
];

console.log('🎨 Generating icon sizes from logo.jpg...\n');

for (const size of sizes) {
  try {
    await sharp(logoPath)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 95 })
      .toFile(join(publicDir, size.name));

    console.log(`✅ Generated ${size.name} (${size.width}x${size.height})`);
  } catch (error) {
    console.error(`❌ Failed to generate ${size.name}:`, error.message);
  }
}

console.log('\n✨ Icon generation complete!');
