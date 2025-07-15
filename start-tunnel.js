const { execSync } = require('child_process');

console.log('Starting Expo with tunnel...');

try {
  execSync('npx expo start --tunnel', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting Expo with tunnel:', error.message);
  process.exit(1);
}