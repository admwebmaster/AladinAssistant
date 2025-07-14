#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');

// Check if we're in a Replit environment
const isReplit = process.env.REPLIT_DOMAIN || process.env.REPLIT;

if (isReplit) {
  console.log('Starting Expo development server...');
  
  // Add dev script to package.json if it doesn't exist
  const packageJsonPath = './package.json';
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts.dev) {
      packageJson.scripts.dev = 'expo start';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Added dev script to package.json');
    }
  }
  
  // Start Expo
  const child = exec('npx expo start', {
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });
  
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  child.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  child.on('error', (error) => {
    console.error('Error:', error);
  });
  
  child.on('exit', (code) => {
    console.log(`Process exited with code ${code}`);
  });
} else {
  console.log('Not in Replit environment, starting normally...');
  exec('npm start', { stdio: 'inherit' });
}