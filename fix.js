const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) {
      walk(p);
    } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf8');
      if (c.includes('@/lib/notify')) {
        let changed = false;
        const regex = /(?<!await\s+)(notify[A-Za-z0-9]+)(\s*\()/g;
        if (regex.test(c)) {
          c = c.replace(regex, 'await $1$2');
          changed = true;
        }
        if (changed) {
          fs.writeFileSync(p, c);
          console.log('Fixed:', p);
        }
      }
    }
  }
}
walk('src/app/api');
