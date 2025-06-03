import fs from 'fs';
import path from 'path';

const directoryPath = './src/views'; // Change to your project directory

function renameFilesInDirectory(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      fs.stat(fullPath, (err, stats) => {
        if (err) throw err;
        if (stats.isDirectory()) {
          renameFilesInDirectory(fullPath);
        } else if (
          path.extname(file) === '.js' &&
          file.toLowerCase() !== 'data.js' // Skip data.js file
        ) {
          const newFileName = fullPath.replace(/\.js$/, '.jsx');
          fs.rename(fullPath, newFileName, (err) => {
            if (err) throw err;
            console.log(`Renamed: ${file} -> ${path.basename(newFileName)}`);
          });
        }
      });
    });
  });
}

renameFilesInDirectory(directoryPath);
