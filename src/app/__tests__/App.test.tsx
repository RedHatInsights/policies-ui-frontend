import { fetchRBAC, Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { act, render, screen, waitFor } from '@testing-library/react';
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
jest.mock('../../InsightsRoutes', () => {
    const MockedRoutes: React.FunctionComponent = () => <div data-testid="content" />;
    return {
        Routes: MockedRoutes
    };
});

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
    return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __esModule: true,
        default: () => ({
            updateDocumentTitle: jest.fn(),
            auth: {
                getUser: () =>
                    Promise.resolve({
                        identity: {
                            account_number: '0',
                            type: 'User',
                            user: {
                                is_org_admin: true
                            }
                        },
                        entitlements: {
                            hybrid_cloud: { is_entitled: true },
                            insights: { is_entitled: true },
                            openshift: { is_entitled: true },
                            smart_management: { is_entitled: false }
                        }
                    })
            },
            appAction: jest.fn(),
            appObjectId: jest.fn(),
            on: jest.fn(),
            getUserPermissions: () => Promise.resolve([ 'inventory:*:*' ]),
            isBeta: jest.fn(),
            getApp: () => 'patch',
            getBundle: () => 'insights'
        }),
        useChrome: () => ({
            isBeta: jest.fn()
        })
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

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        jest.restoreAllMocks();
    });

    it('Shows the content when RBAC.canReadAll is set', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve(new Rbac({
            policies: {
                policies: [ 'read', 'write' ]
            }
        })));
        render(
            <App />,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(await screen.findByTestId('content')).toBeInTheDocument();
    });

    it('Shows error when RBAC does not have read access', async () => {
        jest.useFakeTimers();
        (fetchRBAC as jest.Mock).mockImplementation(() => Promise.resolve(new Rbac({
            policies: {
                policies: [ 'write' ]
            }
        })));
        render(
            <App />,
            {
                wrapper: AppWrapper
            }
        );

        await act(async () => {
            await jest.advanceTimersToNextTimer();
        });

        expect(await screen.findByText(/You do not have access to Policies/i)).toBeInTheDocument();
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

        await waitFor(() => expect(hideGlobalFilter).toHaveBeenCalled());
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
