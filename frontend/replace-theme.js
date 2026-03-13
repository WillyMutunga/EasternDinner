const fs = require('fs');
const path = require('path');

const replacements = {
    '--color-royal-blue-light': '--color-sky-blue-light',
    '--color-royal-blue': '--color-sky-blue',
    '--color-gold-light': '--color-faded-yellow',
    '--color-bg-dark': '--color-bg-main',
    '--color-text-light': '--color-text-main'
};

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            for (const [key, value] of Object.entries(replacements)) {
                content = content.replace(new RegExp(key, 'g'), value);
            }
            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir('./src');
