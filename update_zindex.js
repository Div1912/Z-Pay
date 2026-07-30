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

walk('d:\\Zpay\\src\\app\\dashboard', (err, results) => {
  if (err) throw err;
  let count = 0;
  results.filter(f => f.endsWith('.tsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/fixed inset-0 z-50/g, 'fixed inset-0 z-[100]');
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`Updated ${file}`);
      count++;
    }
  });
  console.log(`Updated ${count} files.`);
});
