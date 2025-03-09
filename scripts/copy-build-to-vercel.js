/**
 * Script to copy build files to Vercel output directory
 * Cross-platform alternative to 'cp -r build/* .vercel/output/static/'
 */

const fs = require('fs');
const path = require('path');

// Source and destination paths
const sourcePath = path.resolve(__dirname, '../build');
const destPath = path.resolve(__dirname, '../.vercel/output/static');

// Ensure destination directory exists
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}

/**
 * Copy directory recursively
 * @param {string} src - Source path
 * @param {string} dest - Destination path
 */
function copyDir(src, dest) {
  // Get all files and directories in the source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Create directory if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      // Recursively copy subdirectory
      copyDir(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log(`Copying build files from ${sourcePath} to ${destPath}...`);
  copyDir(sourcePath, destPath);
  console.log('Successfully copied build files to Vercel output directory');
} catch (error) {
  console.error('Error copying build files:', error);
  process.exit(1);
}
