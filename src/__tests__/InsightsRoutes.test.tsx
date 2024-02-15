import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';

import { InsightsRoutes } from '../InsightsRoutes';

jest.mock('../pages/ListPage/ListPage', () => {
    const ListPageDummyComponent: React.FunctionComponent = () => {
        return <div>ListPage</div>;
    };

    return ListPageDummyComponent;
});

const getWrapper = (path: string) => {
    const data = {} as any;
    const Wrapper: React.FunctionComponent = (props) => {
        return (
            <MemoryRouter initialEntries={ [ path ] }>
                <Route path="*" element={ ({ location }) => {
                    data.location = location;
                    return null;
                } } >
                </Route>
                {/* eslint-disable-next-line testing-library/no-node-access */}
                <div id="root">{props.children}</div>
            </MemoryRouter>
        );
    };

    return {
        Wrapper,
        data
    };
};

describe('src/InsightsRoutes', () => {
    it('Should render the ListPage on /', async () => {
        jest.useFakeTimers();
        const { Wrapper, data } = getWrapper('/');
        render(<InsightsRoutes />, {
            wrapper: Wrapper
        });

        expect(data.location.pathname).toBe('/policies/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });

    it('Should render the ListPage on /list', async () => {
        jest.useFakeTimers();
        const { Wrapper, data } = getWrapper('/');
        render(<InsightsRoutes />, {
            wrapper: Wrapper
        });

        expect(data.location.pathname).toBe('/policies/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });

    it('Should render the ListPage on /random-stuff', async () => {
        jest.useFakeTimers();
        const { Wrapper, data } = getWrapper('/random-stuff');
        render(<InsightsRoutes />, {
            wrapper: Wrapper
        });

        expect(data.location.pathname).toBe('/policies/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });
});
