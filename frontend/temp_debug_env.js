const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve('.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    console.log('Keys found in .env.local:');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            console.log(match[1].trim());
        }
    });

} catch (err) {
    console.error(err);
}
