// eslint-disable-next-line @typescript-eslint/no-var-requires
const goodGuyLib = require('good-guy-http');
const SECTION = 'insights';
const APP_ID = 'policies';
const FRONTEND_PORT = 8002;
const API_PORT = 8080;
const routes = {};

routes[`/beta/${SECTION}/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `https://localhost:${FRONTEND_PORT}` };

routes[`/api/policies/`] = { host: `http://localhost:${API_PORT}` };

module.exports = {
    routes,
    esi: {
        // Increases the default (2s) timeout which can be a pain sometimes.
        // https://github.com/Schibsted-Tech-Polska/good-guy-http/blob/master/lib/index.js#L55
        httpClient: goodGuyLib({
            timeout: 5000
        })
    }
};
