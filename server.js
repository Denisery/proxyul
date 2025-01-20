const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;

// Serve static files for the frontend
app.use(express.static('public'));

// Proxy middleware for handling search or link requests
app.use('/proxy', createProxyMiddleware({
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.query.url}`);
  },
  pathRewrite: (path, req) => {
    return req.query.url ? '/' + req.query.url.split('/').slice(3).join('/') : '/';
  },
  router: (req) => req.query.url || '', // Target URL
}));

// Homepage for user input
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Proxy Server</h1>
    <form method="GET" action="/proxy">
        <label>Enter Search URL or Website Link:</label>
        <input type="text" name="url" placeholder="Enter URL" required />
        <button type="submit">Surf</button>
    </form>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});
      
