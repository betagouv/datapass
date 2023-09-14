import { Express } from 'express';
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app: Express) {
  const middleware = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  });
  app.use(['/api', '/users'], middleware);
};
