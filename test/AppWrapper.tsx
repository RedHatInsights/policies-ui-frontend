import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import {
    getInsights,
    initStore,
    restoreStore
} from '@redhat-cloud-services/insights-common-typescript';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import fetchMock from 'fetch-mock';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import * as React from 'react';
import { ClientContextProvider, createClient } from 'react-fetching-library';
import { Provider } from 'react-redux';
import { MemoryRouterProps, RouteProps } from 'react-router';
import { MemoryRouter as Router, Route, useLocation } from 'react-router-dom';

import { AppContext } from '../src/app/AppContext';

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => {
    const AsyncComponentDummyComponent: React.FunctionComponent = () => {
        return <div>AsyncComponent</div>;
    };

    return AsyncComponentDummyComponent;
});

let setup = false;
let client;
let store;

export const appWrapperSetup = () => {
    if (setup) {
        throw new Error('Looks like appWrapperCleanup has not been called, you need to call it on the afterEach');
    }

    setup = true;
    fetchMock.mock();
    client = createClient({
        responseInterceptors: [ validateSchemaResponseInterceptor ]
    });
    store = initStore().getStore();

    const mock = new MockAdapter(axios);
    mock.onGet('/api/inventory/v1/hosts?page=1&per_page=1').reply(200,
        {
            total: 5,
            count: 10,
            page: 1,
            per_page: 1,
            results: []
        }
    );
};

export const appWrapperCleanup = () => {
    try {
        const calls = fetchMock.calls(false).filter(c => c.isUnmatched || c.isUnmatched === undefined);
        if (calls.length > 0) {
            throw new Error(`Found ${ calls.length } unmatched calls, maybe you forgot to mock? : ${calls.map(c => c.request?.url || c['0'])}`);
        }
    } finally {
        setup = false;
        restoreStore();
        client = undefined;
        store = undefined;
        fetchMock.restore();
    }
};

type Config = {
    router?: MemoryRouterProps;
    route?: RouteProps;
    appContext?: AppContext;
    getLocation?: jest.Mock; // Pass a jest.fn() to get back the location hook
}

const defaultAppContextSettings = {
    rbac: {
        canWritePolicies: true,
        canReadPolicies: true
    },
    userSettings: {
        settings: undefined,
        isSubscribedForNotifications: false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        refresh: () => {}
    }
};

const InternalWrapper: React.FunctionComponent<Config> = (props) => {
    const location = useLocation();

    (getInsights().chrome.isBeta as jest.Mock).mockImplementation(() => {
        return location.pathname.startsWith('/preview/');
    });

    if (props.getLocation) {
        props.getLocation.mockImplementation(() => location);
    }

    return <>{ props.children }</>;
};

export const AppWrapper: React.FunctionComponent<Config> = (props) => {
    if (!setup) {
        throw new Error('appWrapperSetup has not been called, you need to call it on the beforeEach');
    }

    return (
        <Provider store={ store }>
            <Router { ...props.router } >
                <ClientContextProvider client={ client }>
                    <AppContext.Provider value={ props.appContext || defaultAppContextSettings }>
                        <InternalWrapper { ...props }>
                            <NotificationsPortal />
                            <Route { ...props.route } >
                                { props.children }
                            </Route>
                        </InternalWrapper>
                    </AppContext.Provider>
                </ClientContextProvider>
            </Router>
        </Provider>
    );
};

export const getConfiguredAppWrapper = (config?: Config) => {
    const ConfiguredAppWrapper: React.FunctionComponent = (props) => {
        return (
            <AppWrapper { ...config }>{ props.children }</AppWrapper>
        );
    };

    return ConfiguredAppWrapper;
};
