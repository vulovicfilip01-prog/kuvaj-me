const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 192, 384, 512];
const inputIcon = path.join(__dirname, 'public', 'icon.png');

async function generateIcons() {
    console.log('🎨 Generating PWA icons...\n');

    // Standard icons
    for (const size of sizes) {
        const outputPath = path.join(__dirname, 'public', `icon-${size}x${size}.png`);
        await sharp(inputIcon)
            .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .toFile(outputPath);
        console.log(`✅ Generated icon-${size}x${size}.png`);
    }

    // Maskable icons with padding for adaptive icons
    const maskableSizes = [192, 512];
    for (const size of maskableSizes) {
        const outputPath = path.join(__dirname, 'public', `icon-maskable-${size}x${size}.png`);
        const padding = Math.floor(size * 0.2); // 20% padding for safe zone

        await sharp(inputIcon)
            .resize(size - padding * 2, size - padding * 2, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .extend({
                top: padding,
                bottom: padding,
                left: padding,
                right: padding,
                background: { r: 85, g: 107, b: 47, alpha: 1 } // theme_color from manifest
            })
            .toFile(outputPath);
        console.log(`✅ Generated icon-maskable-${size}x${size}.png (with safe zone)`);
    }

    console.log('\n🎉 All PWA icons generated successfully!');
}

generateIcons().catch(err => {
    console.error('❌ Error generating icons:', err);
    process.exit(1);
});
