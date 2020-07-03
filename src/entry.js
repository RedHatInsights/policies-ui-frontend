import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init, getBaseName, client } from 'common-code-ui';
import App from './app/App';
import { ClientContextProvider } from 'react-fetching-library';

ReactDOM.render(
    <Provider store={ init().getStore() }>
        <Router basename={ getBaseName(window.location.pathname) }>
            <ClientContextProvider client={ client }>
                <App />
            </ClientContextProvider>
        </Router>
    </Provider>,

    document.getElementById('root')
);
