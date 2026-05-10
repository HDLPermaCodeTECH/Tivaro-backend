const { execSync } = require('child_process');
console.log('Building app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (e) {
  console.error('Build failed but trying to start anyway...', e);
}
console.log('Starting app...');
require('./dist/index.js');
