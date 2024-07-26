import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock  from 'fetch-mock';
import { suppressValidateError } from 'openapi2typescript/react-fetching-library';
import * as React from 'react';
import { useState } from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../test/TestUtils';
import { Operations } from '../../../generated/Openapi';
import { linkTo } from '../../../Routes';
import ListPage from '../ListPage';

jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
    const real = jest.requireActual('@redhat-cloud-services/insights-common-typescript');
    return {
        ...real,
        useUrlState: (p) => useState(p)
    };
});
jest.mock('../../../hooks/useFacts');
jest.mock('@redhat-cloud-services/frontend-components', () => {
    const MockedSkeletonTable = () => <div>Loading Policies</div>;

    return {
        ...jest.requireActual('@redhat-cloud-services/frontend-components') as Record<string, any>,
        SkeletonTable: MockedSkeletonTable
    };
});

describe('src/pages/ListPage', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    const mockPolicies = [
        {
            actions: 'notification',
            conditions: 'facts.arch = "x86_64"',
            ctime: '2020-06-02 16:11:09.622',
            description: 'Description for policy 1',
            id: 'foo',
            isEnabled: true,
            lastTriggered: 1591132435642,
            mtime: '2020-06-02 16:11:48.428',
            name: 'Policy 1'
        },
        {
            actions: 'notification',
            conditions: 'facts.arch = "x86_64"',
            ctime: '2020-06-02 16:11:09.622',
            description: 'Description for policy 2',
            id: 'bar',
            isEnabled: true,
            lastTriggered: 1591132435642,
            mtime: '2020-06-02 16:11:48.428',
            name: 'Policy 2'
        },
        {
            actions: 'notification',
            conditions: 'facts.arch = "x86_64"',
            ctime: '2020-06-02 16:11:09.622',
            description: 'Description for policy 3',
            id: 'baz',
            isEnabled: true,
            lastTriggered: 1591132435642,
            mtime: '2020-06-02 16:11:48.428',
            name: 'Policy 3'
        },
        {
            actions: 'notification',
            conditions: 'facts.arch = "x86_64"',
            ctime: '2020-06-02 16:11:09.622',
            description: 'Description for policy 4',
            id: 'foobar',
            isEnabled: true,
            lastTriggered: 1591132435642,
            mtime: '2020-06-02 16:11:48.428',
            name: 'Policy 4'
        }
    ];

    type FetchMockSetupType = {
        status?: number;
        policies?: any;
        count?: number;
        emptyPayload?: boolean;
    };

    const fetchMockSetup = (config?: FetchMockSetupType) => {
        fetchMock.getOnce(Operations.GetPolicies.actionCreator({
            limit: 20,
            offset: 0
        }).endpoint, {
            status: config?.status || 200,
            body: config?.emptyPayload === true ? undefined : {
                meta: {
                    count: config?.count || 100
                },
                data: config?.policies || mockPolicies
            }
        }, {
            overwriteRoutes: true
        });
    };

    it('Refuses to show data if rbac.readAll is false', async () => {
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.listPage() ]
                },
                route: {
                    path: linkTo.listPage()
                },
                appContext: {
                    rbac: {
                        canWritePolicies: true,
                        canReadPolicies: false
                    },
                    userSettings: {
                        isSubscribedForNotifications: false,
                        refresh: () => '',
                        settings: undefined
                    }
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.getAllByText(/0 - 0/).length).toBeGreaterThan(0);
    });

    it('Has title "Policies"', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });
        await waitForAsyncEvents();

        expect(screen.getByText('Policies', { selector: 'h1' })).toBeVisible();
    });

    it('Renders policies data"', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();

        expect(screen.getByText('Policy 1')).toBeVisible();
        expect(screen.getByText('Policy 2')).toBeVisible();
        expect(screen.getByText('Policy 3')).toBeVisible();
        expect(screen.getByText('Policy 4')).toBeVisible();
    });

    it('Policy name is a link in stable too"', async () => {
        fetchMockSetup();
        const getLocation = jest.fn();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [
                        '/policies/list'
                    ]
                },
                getLocation
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByText('Policy 1'));
        await waitForAsyncEvents();

        expect(getLocation().pathname).not.toEqual('/policies/list');
    });

    it('Nothing is sorted by default', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();

        expect(screen.getByText(/name/i, {
            selector: 'th span'
            // eslint-disable-next-line testing-library/no-node-access
        }).closest('th')).toHaveAttribute('aria-sort', 'none');
    });

    it('Shows empty state when no policy is found', async () => {
        fetchMockSetup({
            status: 404,
            emptyPayload: true
        });
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/No Policies/i, {
            selector: 'h5'
        })).toBeVisible();
    });

    it('Shows reload required on 401', async () => {
        suppressValidateError();
        fetchMockSetup({
            status: 401,
            emptyPayload: true
        });
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/Refresh your browser/i, {
            selector: 'h5'
        })).toBeVisible();
    });

    it('Reloads browser when clicking on Reload page button', async () => {
        suppressValidateError();
        fetchMockSetup({
            status: 401,
            emptyPayload: true
        });

        const location: Location = window.location;
        const windowAsAny = window as any;
        delete windowAsAny.location;
        window.location = {
            ...location,
            reload: jest.fn()
        };

        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByText('Reload page'));
        await waitForAsyncEvents();

        expect(window.location.reload).toHaveBeenCalledTimes(1);
        window.location = location;
    });

    it('Shows internal server errors on status 500', async () => {
        suppressValidateError();
        fetchMockSetup({
            status: 500,
            emptyPayload: true
        });
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/Internal server error/i, {
            selector: 'h5'
        })).toBeVisible();
    });

    it('Shows Unable to connect on other error status', async () => {
        suppressValidateError();
        fetchMockSetup({
            status: 504,
            emptyPayload: true
        });
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/Unable to connect/i, {
            selector: 'h5'
        })).toBeVisible();
    });

    it('When clicking the retry button on the error status, it loads the query again', async () => {
        suppressValidateError();
        fetchMockSetup({
            status: 504,
            emptyPayload: true
        });
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        fetchMockSetup();

        userEvent.click(screen.getByText('Try again'));

        await waitForAsyncEvents();
        expect(screen.getByText('Policy 1')).toBeVisible();
    });

    it('Clicking on the expanded button shows the description', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getAllByLabelText('Details')[0]);

        await waitForAsyncEvents();
        expect(screen.getByText('Description for policy 1')).toBeVisible();
    });

    it('Is possible to expand all policies at the same time', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        screen.getAllByLabelText('Details').forEach((e => {
            userEvent.click(e);
        }));

        await waitForAsyncEvents();
        expect(screen.getByText('Description for policy 1')).toBeVisible();
        expect(screen.getByText('Description for policy 2')).toBeVisible();
        expect(screen.getByText('Description for policy 3')).toBeVisible();
        expect(screen.getByText('Description for policy 4')).toBeVisible();
    });

    it('Create policy button opens the create policy wizard', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByText('Create policy'));

        await waitForAsyncEvents();
        expect(screen.getByText('Create a policy')).toBeInTheDocument();
    });

    it('Create policy wizard can be closed', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByText('Create policy'));

        await waitForAsyncEvents();
        userEvent.click(screen.getByText('Cancel'));

        expect(screen.queryByText('Create a policy')).not.toBeInTheDocument();
    });

    it('Title is "Policies - Red Hat Insights"', async () => {
        fetchMockSetup();
        render(<ListPage />, {
            wrapper: getConfiguredAppWrapper()
        });

        await waitForAsyncEvents();
        expect(document.title).toEqual('Policies - Operations');
    });
});
