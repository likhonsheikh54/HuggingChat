// This script copies the build output to the directory expected by Vercel
const fs = require('fs');
const path = require('path');

// Source and destination directories
const srcDir = path.join(__dirname, '..', '.svelte-kit', 'output');
const destDir = path.join(__dirname, '..', '.vercel', 'output');

function copyFolderRecursiveSync(source, destination) {
  // Check if source exists
  if (!fs.existsSync(source)) {
    console.error(`Source directory not found: ${source}`);
    process.exit(1);
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
    console.log(`Created directory: ${destination}`);
  }

  // Get all files and directories in the source
  const files = fs.readdirSync(source);

  // Copy each file/directory
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);

    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      // Recursively copy subdirectories
      copyFolderRecursiveSync(sourcePath, destinationPath);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destinationPath);
      console.log(`Copied file: ${sourcePath} -> ${destinationPath}`);
    }
  });
}

console.log('Starting build output copy process for Vercel deployment...');
console.log(`Source: ${srcDir}`);
console.log(`Destination: ${destDir}`);

copyFolderRecursiveSync(srcDir, destDir);

console.log('Build output successfully copied to Vercel directory!');
