const SECTION = 'insights';
const APP_ID = 'custom-policies';
const FRONTEND_PORT = 8002;
const routes = {};

routes[`/${SECTION}/${APP_ID}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/${SECTION}/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/${SECTION}/${APP_ID}`] = { host: `https://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${APP_ID}`]       = { host: `https://localhost:${FRONTEND_PORT}` };

// For testing a new menu, see:
// https://github.com/RedHatInsights/cloud-services-config#testing-your-changes-locally

module.exports = { routes };
