import fs from "fs";
import path from "path";

const directoryPath = "./src";

// Folders where .js files should be renamed to .jsx
const includedFolders = [
  "components",
  "context",
  "guards",
  "layouts",
  "ui",
  "views",
];

function isIncludedFolder(filePath) {
  const pathParts = filePath.split(path.sep);
  return includedFolders.some((folder) => pathParts.includes(folder));
}

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
          path.extname(file) === ".js" &&
          file.toLowerCase() !== "data.js" && // Skip data.js file
          file.toLowerCase() !== "utils.js" && // Skip utils.js file
          isIncludedFolder(fullPath) // Skip files in excluded folders
        ) {
          const newFileName = fullPath.replace(/\.js$/, ".jsx");
          fs.rename(fullPath, newFileName, (err) => {
            if (err) throw err;
            console.log(`Renamed: ${file} -> ${path.basename(newFileName)}`);
          });
        } else if (
          path.extname(file) === ".js" &&
          !isIncludedFolder(fullPath)
        ) {
          console.log(`Skipped: ${file}`);
        }
      });
    });
  });
}

renameFilesInDirectory(directoryPath);
