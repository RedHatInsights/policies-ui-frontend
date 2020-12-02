import { fetchRBAC, Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { act, render, screen } from '@testing-library/react';
import * as React from 'react';

import { AppWrapper, appWrapperCleanup, appWrapperSetup } from '../../../test/AppWrapper';
import App from '../App';

jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
    const real = jest.requireActual('@redhat-cloud-services/insights-common-typescript');
    const MockedAppSkeleton: React.FunctionComponent = () => <div data-testid="loading"><real.AppSkeleton /></div>;
    return {
        ...real,
        AppSkeleton: MockedAppSkeleton,
        fetchRBAC: jest.fn(real.fetchRBAC)
    };
});
jest.mock('../../services/useUserSettingsEmailQuery');
jest.mock('../../Routes', () => {
    const MockedRoutes: React.FunctionComponent = () => <div data-testid="content" />;
    return {
        Routes: MockedRoutes
    };
});

describe('src/app/App', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Shows loading when RBAC is not set', async () => {
        jest.useFakeTimers();
        const promise = new Promise<Rbac>(jest.fn());
        (fetchRBAC as jest.Mock).mockImplementation(() => promise);
        render(
            <App />,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('loading')).toBeTruthy();
        jest.restoreAllMocks();
    });

    it('Shows the content when RBAC.canReadAll is set', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve({
            canReadAll: true,
            canWriteAll: true
        }));
        render(
            <App />,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByTestId('content')).toBeTruthy();
    });

    it('Shows error when RBAC does not have read access', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve({
            canReadAll: false,
            canWriteAll: true
        }));
        render(
            <App />,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(screen.getByText(/You do not have access to Policies/i)).toBeTruthy();
    });

    it('Will call chrome.hideGlobalFilter when defined', async () => {
        const hideGlobalFilter = jest.fn();
        (global as any).insights.chrome.hideGlobalFilter = hideGlobalFilter;
        render(
            <App />,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(hideGlobalFilter).toHaveBeenCalled();
    });

    it('Wont crash if chrome.hideGlobalFilter is undefined', async () => {
        (global as any).insights.chrome.hideGlobalFilter = undefined;
        expect(() => async () => {
            render(
                <App />,
                {
                    wrapper: AppWrapper
                }
            );

            await act(async () => {
                await jest.advanceTimersToNextTimer();
            });
        }).not.toThrow();
    });
});
