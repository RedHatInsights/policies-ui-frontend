import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

import { PoliciesRoutes } from '../Routes';

jest.mock('../pages/ListPage/ListPage', () => {
    const ListPageDummyComponent: React.FunctionComponent<{children: React.ReactNode}> = () => {
        return <div>ListPage</div>;
    };

    return ListPageDummyComponent;
});

const LocationProvider = (props) => {
    const location = useLocation();

    if (props.getLocation) {
        props.getLocation.mockImplementation(() => location);
    }

    // eslint-disable-next-line testing-library/no-node-access
    return <>{ props.children }</>;
};

const getWrapper = (path: string, getLocation: () => jest.Mock) => {
    const Wrapper: React.FunctionComponent = (props) => {
        return (
            <MemoryRouter initialEntries={ [ path ] }>
                <LocationProvider getLocation={ getLocation }>
                    {/* eslint-disable-next-line testing-library/no-node-access */}
                    <div id="root">{props.children}</div>
                </LocationProvider>
            </MemoryRouter>
        );
    };

    return Wrapper;
};

describe('src/Routes', () => {
    it('Should render the ListPage on /', async () => {
        jest.useFakeTimers();
        const getLocation = jest.fn();

        const Wrapper = getWrapper('/', getLocation);
        render(<PoliciesRoutes />, {
            wrapper: Wrapper
        });

        expect(getLocation().pathname).toBe('/policies/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });

    it('Should render the ListPage on /list', async () => {
        jest.useFakeTimers();
        const getLocation = jest.fn();

        const Wrapper = getWrapper('/', getLocation);
        render(<PoliciesRoutes />, {
            wrapper: Wrapper
        });

        expect(getLocation().pathname).toBe('/policies/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });

    it('Should render the ListPage on /random-stuff', async () => {
        jest.useFakeTimers();
        const getLocation = jest.fn();

        const Wrapper = getWrapper('/random-stuff', getLocation);
        render(<PoliciesRoutes />, {
            wrapper: Wrapper
        });

        expect(getLocation().pathname).toBe('/policies/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });
});
