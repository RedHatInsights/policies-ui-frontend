import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PolicyDetail } from '../PolicyDetail';
import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../test/AppWrapper';
import { linkTo } from '../../../Routes';
import fetchMock = require('fetch-mock');
import { actionGetPoliciesById, actionGetPoliciesByIdHistoryTrigger } from '../../../generated/ActionCreators';

describe('src/Pages/PolicyDetail/PolicyDetail', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    const fetchMockDefaultPolicy = () => {
        fetchMock.getOnce(actionGetPoliciesById({
            id: 'foo'
        }).endpoint, {
            body: {
                actions: 'email',
                conditions: 'facts.arch = "x86_64"',
                ctime: '2020-06-02 16:11:09.622',
                description: 'Fail if we are running on a x86_64',
                id: 'foo',
                isEnabled: true,
                lastTriggered: 1591132435642,
                mtime: '2020-06-02 16:11:48.428',
                name: 'Not arch x86_64'
            },
            status: 200
        });

        fetchMock.getOnce(actionGetPoliciesByIdHistoryTrigger({
            id: 'foo'
        }).endpoint, {
            body: [
                {
                    ctime: 1591132431400,
                    hostName: 'foo-bar',
                    id: 'my-stuff'
                },
                {
                    ctime: 1591132404157,
                    hostName: 'random host',
                    id: 'foo-bar-id'
                },
                {
                    ctime: 1591132300131,
                    hostName: 'random host',
                    id: 'foo-bar-id'
                },
                {
                    ctime: 1591132299051,
                    hostName: 'foo-bar',
                    id: 'my-stuff'
                }
            ]
        });
    };

    it('Refuses to show data if rbac.readAll is false', async () => {
        fetchMockDefaultPolicy();
        render(<PolicyDetail/>, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                },
                appContext: {
                    rbac: {
                        canWriteAll: true,
                        canReadAll: false
                    },
                    userSettings: {
                        isSubscribedForNotifications: false,
                        refresh: () => '',
                        settings: undefined
                    }
                }
            })
        });

        await act(async () => {

        });

        expect(screen.getByText('You do not have access to Policies')).toBeVisible();
    });

    it('Renders policy data', async () => {
        fetchMockDefaultPolicy();
        render(<PolicyDetail/>, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await act(async () => {

        });

        expect(screen.getByText('Not arch x86_64', {
            selector: 'h1'
        })).toBeVisible();
        expect(screen.getByText('Enabled')).toBeVisible();
        expect(screen.queryAllByText('foo-bar').length).toBe(2);
        expect(screen.queryAllByText('random host').length).toBe(2);
    });

    it('Sorts date descending by default ', async () => {
        fetchMockDefaultPolicy();
        render(<PolicyDetail/>, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await act(async () => {

        });
        expect(screen.getByText(/date/i, {
            selector: 'th > button'
        }).parentElement).toHaveAttribute('aria-sort', 'descending');
    });
});
