import { render, screen } from '@testing-library/react';
import React from 'react';

import { linkTo } from '../src/InsightsRoutes';
import { AppWrapper, appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from './AppWrapper';

const ChildComponent: React.FunctionComponent = () => (
    <div className='ChildComponent' data-testid={ 'ChildComponent' } />
);

describe.skip('test/AppWrapper/AppWrapper()', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('render ChildComponent wrapped in AppWrapper', async () => {
        render(
            <AppWrapper>
                <ChildComponent />
            </AppWrapper>
        );

        expect(await screen.findByTestId('ChildComponent')).toBeInTheDocument();
    });
});

describe.skip('test/AppWrapper/getConfiguredAppWrapper()', () => {
    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('render ChildComponent wrapped in getConfiguredAppWrapper', async () => {
        const ConfiguredAppWrapper = getConfiguredAppWrapper({
            router: {
                initialEntries: [ '/' ]
            },
            route: {
                path: '/'
            }
        });
        render(
            <ConfiguredAppWrapper>
                <ChildComponent />
            </ConfiguredAppWrapper>
        );

        expect(await screen.findByTestId('ChildComponent')).toBeInTheDocument();
    });

    it('render ChildComponent wrapped in getConfiguredAppWrapper on PolicyDetail url', async () => {
        const ConfiguredAppWrapper = getConfiguredAppWrapper({
            router: {
                initialEntries: [ linkTo.policyDetail('PolicyName') ]
            },
            route: {
                path: linkTo.policyDetail(':policyId')
            }
        });
        render(
            <ConfiguredAppWrapper>
                <ChildComponent />
            </ConfiguredAppWrapper>
        );
        expect(await screen.findByTestId('ChildComponent')).toBeInTheDocument();
    });

    it('render ChildComponent wrapped in getConfiguredAppWrapper on ListPage url', async () => {
        const ConfiguredAppWrapper = getConfiguredAppWrapper({
            router: {
                initialEntries: [ linkTo.listPage() ]
            },
            route: {
                path: linkTo.listPage()
            }
        });
        render(
            <ConfiguredAppWrapper>
                <ChildComponent />
            </ConfiguredAppWrapper>
        );
        expect(await screen.findByTestId('ChildComponent')).toBeInTheDocument();
    });

    it.skip('render ChildComponent wrapped in getConfiguredAppWrapper with Context', async () => {});
});
