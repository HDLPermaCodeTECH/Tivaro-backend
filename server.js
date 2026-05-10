const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('CWD:', process.cwd());
console.log('Dirname:', __dirname);

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
console.log('Checking node_modules at:', nodeModulesPath);

if (!fs.existsSync(nodeModulesPath)) {
  console.log('node_modules not found! Running npm install...');
  try {
    // Run npm install
    execSync('npm install --production', { stdio: 'inherit', cwd: __dirname });
    console.log('npm install completed successfully.');
  } catch (error) {
    console.error('Failed to run npm install:', error);
  }
} else {
  console.log('node_modules found.');
}

// Now try to run the actual app
console.log('Requiring dist/index.js...');
try {
  require(path.join(__dirname, 'dist', 'index.js'));
} catch (error) {
  console.error('Failed to require dist/index.js:', error);
  
  // Fallback to a minimal server so we don't get 503 if the above fails
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'error', 
      message: 'Failed to load main app, but server is running.',
      error: error.message 
    }));
  });
  
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fallback server running on port ${PORT}`);
  });
}
