const fs = require('fs');
const iconv = require('iconv-lite');

const buffer = fs.readFileSync('0-50.csv');

console.log('Testing ISO-8859-2:\n');
const text = iconv.decode(buffer, 'iso-8859-2');
const lines = text.split(/\r?\n/);

console.log('Line 2:', lines[1].substring(0, 150));
console.log('Line 50:', lines[50]?.substring(0, 150));

// Check specific words
const line2 = lines[1];
if (line2.includes('Klasična')) console.log('✓ Has "Klasična"');
if (line2.includes('Mleveno')) console.log('✓ Has "Mleveno"');
if (line2.includes('š')) console.log('✓ Has "š"');
if (line2.includes('ć')) console.log('✓ Has "ć"');
if (line2.includes('č')) console.log('✓ Has "č"');
