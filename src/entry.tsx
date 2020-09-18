import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
    initStore,
    createFetchingClient,
    getBaseName,
    getStore,
    getInsights, validateSchemaResponseInterceptor
} from '@redhat-cloud-services/insights-common-typescript';
import App from './app/App';
import { ClientContextProvider } from 'react-fetching-library';

const client = createFetchingClient(getInsights, {
    responseInterceptors: [ validateSchemaResponseInterceptor ]
});
initStore();

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
