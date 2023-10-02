const createProxyMiddleware = require('http-proxy-middleware');
const { env } = require('process');

let target = 'http://localhost:33330';

if (env.ASPNETCORE_HTTPS_PORT) {
    target = `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`;
} else if (env.ASPNETCORE_URLS) {
    const url = new URL(env.ASPNETCORE_URLS.split(';')[0]);

    if (url.protocol === 'https:') {
        target = `https://localhost:${url.port}`;
    } else {
        target = `http://localhost:${url.port}`;
    }
}

const context = ["/api"];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: target,
        secure: false,
        headers: {
            Connection: 'Keep-Alive'
        }
    });

    app.use(appProxy);
};