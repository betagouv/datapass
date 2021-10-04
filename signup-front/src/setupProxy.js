const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const middleware = createProxyMiddleware({
    target: 'https://back.datapass-test.api.gouv.fr',
    changeOrigin: true,
    secure: false,
  });
  app.use(['/api', '/users'], middleware);
};
