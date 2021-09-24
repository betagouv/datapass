const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const middleware = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  });
  app.use(['/api', '/users'], middleware);
};
