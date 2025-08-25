const fs = require('fs');
const path = require('path');

function renameFiles(dir, fromExt, toExt) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      renameFiles(fullPath, fromExt, toExt);
    } else if (path.extname(file) === fromExt) {
      const newPath = path.join(dir, file.replace(fromExt, toExt));
      fs.renameSync(fullPath, newPath);
      console.log(`Renamed: ${fullPath} -> ${newPath}`);
    }
  }
}

// Rename .js files to .mjs in the esm directory
const esmDir = path.join(__dirname, '..', 'dist', 'esm');
if (fs.existsSync(esmDir)) {
  renameFiles(esmDir, '.js', '.mjs');
  console.log('ESM file renaming completed');
} else {
  console.log('ESM directory not found');
}