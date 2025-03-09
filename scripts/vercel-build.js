// This script is used by Vercel to build the project
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Log the current directory and files
console.log('Current directory:', process.cwd());
console.log('Files in directory:', fs.readdirSync('.'));

// Check if .env.local exists, if not create a minimal version for Vercel
if (!fs.existsSync('.env.local')) {
  console.log('Creating .env.local for Vercel deployment');
  
  // Get environment variables from Vercel
  const mongodbUrl = process.env.MONGODB_URL || '';
  const hfToken = process.env.HF_TOKEN || '';
  
  // Create a basic .env.local file with required variables
  const envContent = `MONGODB_URL=${mongodbUrl}\nHF_TOKEN=${hfToken}\n`;
  
  // Write to .env.local
  fs.writeFileSync('.env.local', envContent);
  console.log('.env.local created successfully');
}

// Run the build command
try {
  console.log('Running vite build...');
  execSync('vite build', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
