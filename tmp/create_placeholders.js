
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createPlaceholders() {
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

    const placeholderPath = path.join(publicDir, 'placeholder.jpg');
    const categoryPlaceholderPath = path.join(publicDir, 'placeholder-category.jpg');

    // Create a 400x300 light gray placeholder with text
    const svgBuffer = Buffer.from(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" font-family="Arial" font-size="20" fill="#9ca3af" text-anchor="middle" dy=".3em">Görsel Yok</text>
        </svg>
    `);

    await sharp(svgBuffer)
        .jpeg()
        .toFile(placeholderPath);

    await sharp(svgBuffer)
        .jpeg()
        .toFile(categoryPlaceholderPath);

    console.log('Placeholders created successfully.');
}

createPlaceholders().catch(console.error);
