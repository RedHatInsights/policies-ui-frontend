const SECTION = 'insights';
const APP_ID = 'custom-policies';
const FRONTEND_PORT = 8002;
const API_PORT = 8080;
const routes = {};

routes[`/beta/${SECTION}/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `https://localhost:${FRONTEND_PORT}` };

// For testing a new menu, see:
// https://github.com/RedHatInsights/cloud-services-config#testing-your-changes-locally
routes[`/beta/config`]               = { host: `http://localhost:8889` };

routes[`/api/custom-policies/v1.0`] = { host: `http://localhost:${API_PORT}` };

module.exports = { routes };
