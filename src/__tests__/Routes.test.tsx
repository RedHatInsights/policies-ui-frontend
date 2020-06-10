import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Route } from 'react-router';
import { Routes } from '../Routes';
import { MemoryRouter } from 'react-router-dom';
jest.mock('../pages/ListPage/ListPage', (): React.FunctionComponent => () => {
    return <div>ListPage</div>;
});

const getWrapper = (path: string) => {
    const data = {} as any;
    const Wrapper: React.FunctionComponent = (props) => {
        return (
            <MemoryRouter initialEntries={ [ path ] }>
                <Route
                    path="*"
                    render={ ({ location }) => {
                        data.location = location;
                        return null;
                    } }
                />
                <div id="root">{ props.children }</div>
            </MemoryRouter>
        );
    };

    return {
        Wrapper,
        data
    };
};

describe('src/Routes', () => {
    it('Should throw when no id=root element found', () => {
        const LocalWrapper: React.FunctionComponent = (props) => {
            return <MemoryRouter>{ props.children }</MemoryRouter>;
        };

        // Silence the exception, this is being logged because react will recommend to use
        // error boundaries, the exception is still throw.
        const mockConsole = jest.spyOn(console, 'error');
        mockConsole.mockImplementation(() => '');

        expect(() => render(<Routes/>, {
            wrapper: LocalWrapper
        })).toThrowError();

        mockConsole.mockRestore();
    });

    it('Should render the ListPage on /', async () => {
        jest.useFakeTimers();
        const { Wrapper, data } = getWrapper('/');
        render(<Routes/>, {
            wrapper: Wrapper
        });

        expect(data.location.pathname).toBe('/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });

    it('Should render the ListPage on /list', async () => {
        jest.useFakeTimers();
        const { Wrapper, data } = getWrapper('/');
        render(<Routes/>, {
            wrapper: Wrapper
        });

        expect(data.location.pathname).toBe('/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });

    it('Should render the ListPage on /random-stuff', async () => {
        jest.useFakeTimers();
        const { Wrapper, data } = getWrapper('/random-stuff');
        render(<Routes/>, {
            wrapper: Wrapper
        });

        expect(data.location.pathname).toBe('/list');
        expect(screen.getByText('ListPage')).toBeVisible();
    });
});
