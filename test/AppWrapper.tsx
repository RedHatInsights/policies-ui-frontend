import * as React from 'react';
import { init } from '../src/store';
import { RouteProps, Route } from 'react-router';
import { MemoryRouter as Router } from 'react-router-dom';
import { ClientContextProvider, createClient } from 'react-fetching-library';
import { Provider } from 'react-redux';
import fetchMock = require('fetch-mock');
import { MemoryRouterProps, useLocation } from 'react-router';
import { AppContext } from '../src/app/AppContext';
import { linkTo } from '../src/Routes';

let setup = false;
let client;
const store = init().getStore();

export const appWrapperSetup = () => {
    if (setup) {
        throw new Error('Looks like appWrapperCleanup has not been called, you need to call it on the afterEach');
    }

    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);

    setup = true;
    fetchMock.mock();
    client = createClient();
};

export const appWrapperCleanup = () => {
    try {
        const calls = fetchMock.calls(false).filter(c => c.isUnmatched || c.isUnmatched === undefined);
        if (calls.length > 0) {
            throw new Error(`Found ${ calls.length } unmatched calls, maybe you forgot to mock? : ${calls.map(c => c.request?.url || c['0'])}`);
        }
    } finally {
        setup = false;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.getElementById('root')!.remove();

        fetchMock.restore();
    }
};

type Config = {
    router?: MemoryRouterProps;
    route?: RouteProps;
    appContext?: AppContext;
    getLocation?: jest.Mock;
}

const defaultAppContextSettings = {
    rbac: {
        canReadAll: true,
        canWriteAll: true
    },
    userSettings: {
        settings: undefined,
        isSubscribedForNotifications: false,
        refresh: () => {}
    }
};

const InternalWrapper: React.FunctionComponent<Config> = (props) => {
    const location = useLocation();
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
