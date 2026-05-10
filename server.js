const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Intercept /db-check route
  if (req.url === '/db-check') {
    const dbPath = path.join(__dirname, 'prisma', 'tivaro.db');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      cwd: process.cwd(),
      dirname: __dirname,
      dbPath: dbPath,
      exists: fs.existsSync(dbPath),
      envDbUrl: process.env.DATABASE_URL
    }));
    return;
  }

  // Delegate everything else to the Express app in dist/index.js
  try {
    const app = require('./dist/index.js');
    
    // If it's a function (Express app), call it
    if (typeof app === 'function') {
      app(req, res);
    } else if (app.default && typeof app.default === 'function') {
      app.default(req, res);
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error: Loaded module is not an Express app.');
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Failed to load main app: ' + error.message);
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
