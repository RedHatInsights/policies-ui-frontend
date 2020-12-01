import {
    createFetchingClient,
    getBaseName,
    getInsights,
    getStore,
    initStore } from '@redhat-cloud-services/insights-common-typescript';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import ReactDOM from 'react-dom';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import logger from 'redux-logger';

import App from './app/App';

const client = createFetchingClient(getInsights, {
    responseInterceptors: [ validateSchemaResponseInterceptor ]
});
initStore(logger);

ReactDOM.render(
    <Provider store={ getStore() }>
        <Router basename={ getBaseName(window.location.pathname) }>
            <ClientContextProvider client={ client }>
                <App />
            </ClientContextProvider>
        </Router>
    </Provider>,

    document.getElementById('root')
);
