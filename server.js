const path = require('path');

console.log('CWD:', process.cwd());
console.log('Dirname:', __dirname);

// Ang index.js natin ay nagpapatakbo na ng sarili niyang server (app.listen)
// Kaya hindi na natin kailangan gumawa ng bagong server dito sa server.js.
// Direkta na lang natin siyang i-require!

try {
  console.log('Starting app by requiring dist/index.js...');
  require('./dist/index.js');
  console.log('App required successfully.');
} catch (error) {
  console.error('Failed to load main app:', error);
  
  // Fallback server kung sakaling mag-crash ang pag-load
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'error', 
      message: 'Failed to load main app in server.js fallback.',
      error: error.message 
    }));
  });
  
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fallback server running on port ${PORT}`);
  });
}
