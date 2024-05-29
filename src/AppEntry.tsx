import {
    createFetchingClient,
    getInsights
} from '@redhat-cloud-services/insights-common-typescript';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';
import * as Redux from 'redux';

import App from './app/App';
import { createStore } from './store/Store';

interface AppEntryProps {
    logger?: Redux.Middleware;
}

const AppEntry: React.FunctionComponent<AppEntryProps> = () => {

    const client = createFetchingClient(getInsights, {
        responseInterceptors: [ validateSchemaResponseInterceptor ]
    });

    const store = React.useMemo(() => { return createStore().store; }, []);

    return (
        <Provider store={ store }>
            <ClientContextProvider client={ client }>
                <App />
            </ClientContextProvider>
        </Provider>
    );
};

export default AppEntry;
