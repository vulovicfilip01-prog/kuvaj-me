const fs = require('fs');
const iconv = require('iconv-lite');

const buffer = fs.readFileSync('0-50.csv');

console.log('=== Testing Different Encodings ===\n');

const encodings = [
    'utf8',
    'win1250',
    'iso-8859-2',
    'cp1250',
    'windows-1252',
    'latin1'
];

encodings.forEach(encoding => {
    try {
        const text = iconv.decode(buffer, encoding);
        const lines = text.split(/\r?\n/);
        const line1 = lines[1] || '';

        console.log(`${encoding}:`);
        console.log(`  Sample: ${line1.substring(0, 100)}`);

        // Check for correct Serbian characters
        const hasCorrectChars = line1.includes('č') || line1.includes('ć') ||
            line1.includes('ž') || line1.includes('š');
        const hasWrongChars = line1.includes('?') || line1.includes('�');

        console.log(`  Has č,ć,ž,š: ${hasCorrectChars ? '✓' : '✗'}`);
        console.log(`  Has ?,�: ${hasWrongChars ? '✗' : '✓'}`);
        console.log('');
    } catch (e) {
        console.log(`${encoding}: ERROR - ${e.message}\n`);
    }
});
