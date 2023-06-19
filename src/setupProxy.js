const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      '/api', // Specify the endpoint prefix to be proxied
      createProxyMiddleware({
        target: 'http://localhost:3001/', // Set the URL of your backend server
        changeOrigin: true, // Change the origin of the request to match the backend's origin
      })
    );
};
