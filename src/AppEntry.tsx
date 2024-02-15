import {
    createFetchingClient,
    getBaseName,
    getInsights
} from '@redhat-cloud-services/insights-common-typescript';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Redux from 'redux';

import App from './app/App';
import { createStore, resetStore } from './store/Store';

interface AppEntryProps {
    logger?: Redux.Middleware;
}

const AppEntry: React.FunctionComponent<AppEntryProps> = (props) => {

    const client = React.useMemo(() => createFetchingClient(getInsights, {
        responseInterceptors: [ validateSchemaResponseInterceptor ]
    }), []);

    const store = React.useMemo(() => {
        resetStore();
        if (props.logger) {
            return createStore(props.logger).store;
        } else {
            return createStore().store;
        }

    }, [ props.logger ]);

    return (
        <Provider store={ store }>
            <Router basename={ getBaseName(window.location.pathname) }>
                <ClientContextProvider client={ client }>
                    <App />
                </ClientContextProvider>
            </Router>
        </Provider>
    );
};

export default AppEntry;
