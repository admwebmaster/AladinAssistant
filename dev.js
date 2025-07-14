const { spawn } = require('child_process');

// Start Expo development server
const expo = spawn('npx', ['expo', 'start'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

expo.on('error', (error) => {
  console.error('Error starting Expo:', error);
});

expo.on('exit', (code) => {
  console.log(`Expo exited with code ${code}`);
});