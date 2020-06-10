import * as React from 'react';
import { render, act, screen } from '@testing-library/react';
import ListPage from '../ListPage';
import { getStore, init, restore } from '../../../store';
import { Provider } from 'react-redux';
import { ClientContextProvider, createClient } from 'react-fetching-library';

jest.mock('../../../hooks/useUrlState');

const client = createClient();

const Wrapper: React.FunctionComponent = (props) => {
    return (
        <Provider store={ getStore() }>
            <ClientContextProvider client={ client }>
                { props.children }
            </ClientContextProvider>
        </Provider>
    );
};

describe('src/pages/ListPage', () => {

    beforeEach(() => {
        init();
    });

    afterEach(() => {
        restore();
    });

    it('Has title "Policies"', async () => {
        render(<ListPage/>, {
            wrapper: Wrapper
        });

        await act(async () => {

        });

        expect(screen.getByText('Policies', { selector: 'h1' })).toBeVisible();
    });
});
