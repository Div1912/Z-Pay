const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk('d:\\Zpay\\src', (err, results) => {
  if (err) throw err;
  let count = 0;
  results.filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
      .replace(/\[#D4AF37\]/g, 'gold')
      .replace(/\[#0a0a0a\]/g, 'surface');
      
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`Updated ${file}`);
      count++;
    }
  });
  console.log(`Updated ${count} files.`);
});
