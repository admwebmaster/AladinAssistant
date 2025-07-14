const fs = require('fs');
const { execSync } = require('child_process');

// Read current package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add dev script if missing
if (!packageJson.scripts.dev) {
  packageJson.scripts.dev = 'expo start';
  
  // Write back to package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Added dev script to package.json');
}

// Now run expo start
try {
  execSync('npx expo start', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting Expo:', error.message);
  process.exit(1);
}