import * as React from 'react';
import { MemoryRouter, Route } from 'react-router';

export const getRouterWrapper = (initialPath: string) => {
    const data = {} as any;
    const RouterWrapper: React.FunctionComponent = (props) => {
        return (
            <MemoryRouter initialEntries={ [ initialPath ] }>
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
        RouterWrapper,
        data
    };
};
