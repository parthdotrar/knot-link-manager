const fs = require('fs');

const cssPath = 'style.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/{\s*([^}:]+:\s*[^};]+;)\s*([^}:]+:\s*[^};]+;)\s*}/g, '{ $1 $2 }');

css = css.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(cssPath, css);
console.log('Optimized CSS further');

