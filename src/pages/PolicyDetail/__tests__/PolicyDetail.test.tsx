import { Direction, Page, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';
import inBrowserDownload from 'in-browser-download';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../test/AppWrapper';
import { waitForAsyncEvents } from '../../../../test/TestUtils';
import { Operations, Schemas } from '../../../generated/Openapi';
import { linkTo } from '../../../Routes';
import { ServerPolicyRequest, Uuid } from '../../../types/Policy/Policy';
import { PolicyDetail } from '../PolicyDetail';
import Policy = Schemas.Policy;
import { within } from '@testing-library/dom';
import { suppressValidateError } from 'openapi2typescript/react-fetching-library';

jest.mock('../../../hooks/useFacts');
jest.mock('in-browser-download', () => jest.fn());
jest.mock('@redhat-cloud-services/frontend-components', () => {
    const MockedSkeletonTable = () => <div>Loading Triggers</div>;

    return {
        ...jest.requireActual('@redhat-cloud-services/frontend-components') as Record<string, any>,
        SkeletonTable: MockedSkeletonTable
    };
});

describe('src/Pages/PolicyDetail/PolicyDetail', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    type FetchMockConfig = {
        policyStatus?: number;
        policyIsUndefined?: boolean;
        policyId?: string;
        policy?: any;
        policyLoading?: jest.Mock;

        triggers?: any;
        triggerBody?: any;
        triggerLoading?: jest.Mock;
        triggerPage?: number;
        triggerLimit?: number;
        triggersCount?: number;
        triggerStatus?: number;
        noSort?: boolean;
    };

    const mockPolicy = {
        actions: 'notification',
        conditions: 'facts.arch = "x86_64"',
        ctime: '2020-06-02 16:11:09.622',
        description: 'Fail if we are running on a x86_64',
        id: 'foo',
        isEnabled: true,
        lastTriggered: 1591132435642,
        mtime: '2020-06-02 16:11:48.428',
        name: 'Not arch x86_64'
    };

    const mockTriggers = [
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
    ];

    const fetchMockSetup = (config?: FetchMockConfig) => {
        fetchMock.getOnce(Operations.GetPoliciesById.actionCreator({
            id: config?.policyId || 'foo'
        }).endpoint, config?.policyLoading ? new Promise(resolver => config.policyLoading?.mockImplementation(resolver)) : {
            body: config?.policyIsUndefined === true ? undefined : (config?.policy ?? mockPolicy),
            status: config?.policyStatus || 200
        }, {
            overwriteRoutes: false
        });

        fetchMock.getOnce(Operations.GetPoliciesByIdHistoryTrigger.actionCreator({
            id: config?.policyId || 'foo',
            ...(Page.of(
                config?.triggerPage !== undefined ? config.triggerPage : 1,
                config?.triggerLimit || 20,
                undefined,
                config?.noSort === true ? undefined : Sort.by('ctime', Direction.DESCENDING)
            )).toQuery()
        } as unknown as Operations.GetPoliciesByIdHistoryTrigger.Params)
        .endpoint, config?.triggerLoading ? new Promise((resolver) => config.triggerLoading?.mockImplementation(resolver)) : {
            body: config?.triggerBody ?? {
                data: (config?.triggers || mockTriggers),
                meta: {
                    count: config?.triggersCount || (config?.triggers || mockTriggers).length
                }
            },
            status: config?.triggerStatus ?? 200
        }, {
            overwriteRoutes: false
        });
    };

    const fetcMockValidateName = (id?: string) => {
        fetchMock.postOnce(Operations.PostPoliciesValidateName.actionCreator({
            body: 'foo',
            id
        }).endpoint, {
            status: 200,
            body: {
                msg: 'All is cool'
            }
        });
    };

    const fetchMockValidateCondition = () => {
        fetchMock.postOnce(Operations.PostPoliciesValidate.actionCreator({
            body: undefined as unknown as Policy
        }).endpoint, {
            status: 200,
            body: {
                msg: 'good'
            }
        });
    };

    const fetchMockSavePolicy = (edit: boolean, updatePolicy: Partial<ServerPolicyRequest>) => {
        const policy = { ...mockPolicy, ...updatePolicy };

        if (edit) {
            fetchMock.putOnce(Operations.PutPoliciesByPolicyId.actionCreator({
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                policyId: policy.id!,
                body: policy
            }).endpoint, {
                status: 200,
                body: policy
            });
        } else {
            fetchMock.postOnce(Operations.PostPolicies.actionCreator({
                alsoStore: true,
                body: mockPolicy
            }).endpoint, {
                status: 201,
                body: policy
            });
        }
    };

    const fetchMockDelete = () => {
        fetchMock.deleteOnce(Operations.DeletePoliciesIds.actionCreator({
            body: []
        }).endpoint, {
            status: 200,
            body: [ 'foo' ]
        });
    };

    const fetchMockChangeStatus = (enabled: boolean, policyIds: Array<Uuid>, status = 200) => {
        fetchMock.postOnce(Operations.PostPoliciesIdsEnabled.actionCreator({
            enabled,
            body: policyIds
        }).endpoint, {
            status,
            body: policyIds
        });
    };

    it('Refuses to show data if rbac.readAll is false', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
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
        expect(screen.getByText('You do not have access to Policies')).toBeVisible();
    });

    it('Renders policy data', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.getByText('Not arch x86_64', {
            selector: 'h1'
        })).toBeVisible();
        expect(screen.getByText('Enabled')).toBeVisible();
        expect(screen.queryAllByText('foo-bar').length).toBe(2);
        expect(screen.queryAllByText('random host').length).toBe(2);
    });

    it('Shows empty state when policy is not found', async () => {
        fetchMockSetup({
            policyStatus: 404,
            policyIsUndefined: true
        });
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/Policy not found/i)).toBeVisible();
    });

    it('Shows error state when policy has status different than 200 or 404, show status when no error msg', async () => {
        suppressValidateError(1);
        fetchMockSetup({
            policyStatus: 500,
            policy: ''
        });
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/code: 500/i)).toBeVisible();
    });

    it('On the error state, clicking on the button retries the query', async () => {
        suppressValidateError(1);
        fetchMockSetup({
            policyStatus: 400,
            policy: {}
        });
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        fetchMockSetup({
            policyStatus: 200
        });
        userEvent.click(screen.getByRole('button'));

        await waitForAsyncEvents();
        screen.getAllByText(/Not arch x86/i).forEach(e => expect(e).toBeInTheDocument());
    });

    it('Click on edit brings up edit wizard', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/edit/i));

        await waitForAsyncEvents();
        expect(screen.getByText(/Edit a policy/i)).toBeVisible();
    });

    it('Click on duplicate brings up create wizard', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/duplicate/i));

        await waitForAsyncEvents();
        expect(screen.getByText(/Create a policy/i)).toBeVisible();
        expect(screen.getByDisplayValue(/Copy of Not arch x86_64/i)).toBeVisible();
    });

    it('Duplicates navigates to the new policy url', async () => {
        fetchMockSetup();
        fetcMockValidateName(undefined);
        fetchMockValidateCondition();
        fetchMockSavePolicy(false, {
            id: 'bar-123'
        });
        fetchMockSetup({
            policyId: 'bar-123'
        });

        const getLocation = jest.fn();

        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                },
                getLocation
            })
        });

        await waitForAsyncEvents();
        expect(getLocation().pathname).toEqual(linkTo.policyDetail('foo'));
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/duplicate/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Next/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Validate/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Next/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Next/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Finish/i));
        await waitForAsyncEvents();
        expect(getLocation().pathname).toEqual(linkTo.policyDetail('bar-123'));
    });

    it('Edits updates the policy with the new values', async () => {
        fetchMockSetup();
        fetcMockValidateName('foo');
        fetchMockValidateCondition();
        fetchMockSavePolicy(true, {
            name: 'my new name'
        });

        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/edit/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Next/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Next/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Next/i));
        await waitForAsyncEvents();
        userEvent.click(screen.getByText(/Finish/i));
        await waitForAsyncEvents();
        screen.getAllByText('my new name').forEach(e => expect(e).toBeVisible());
    });

    it('Click on remove brings up the remove dialog', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/remove/i));

        await waitForAsyncEvents();
        expect(screen.getByText(/Do you want to remove the policy/i)).toBeVisible();
    });

    it('Remove dialog can be closed', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/remove/i));

        await waitForAsyncEvents();
        userEvent.click(screen.getByText('Cancel'));

        await waitForAsyncEvents();
        expect(screen.queryByText(/Do you want to remove the policy/i)).not.toBeInTheDocument();
    });

    it('When policy is deleted, navigates to list page', async () => {
        fetchMockSetup();
        fetchMockDelete();

        const getLocation = jest.fn();
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                },
                getLocation
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/remove/i));

        await waitForAsyncEvents();
        userEvent.click(screen.getByText('Delete'));

        await waitForAsyncEvents();
        expect(getLocation().pathname).toEqual(linkTo.listPage());
    });
    it('When policy is disabled, it updates the enabled status in the page', async () => {
        fetchMockSetup();
        fetchMockChangeStatus(false, [ 'foo' ]);
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/disable/i));

        await waitForAsyncEvents();
        expect(screen.getByText('Disabled')).toBeVisible();
    });

    it('When policy is enabled, it updates the enabled status in the page to disabled', async () => {
        fetchMockSetup({
            policy: { ...mockPolicy, isEnabled: false }
        });
        fetchMockChangeStatus(true, [ 'foo' ]);
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/enable/i));

        await waitForAsyncEvents();
        expect(screen.getByText('Enabled')).toBeVisible();
    });

    it('When policy is enabled, if the policy was deleted, do not change status and show error', async () => {
        fetchMockSetup({
            policy: { ...mockPolicy, isEnabled: false }
        });
        fetchMockChangeStatus(true, []);
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/enable/i));

        await waitForAsyncEvents();
        expect(screen.getByText('Disabled')).toBeVisible();
        expect(screen.getByText(/It may have been removed by another user/i)).toBeVisible();
    });

    it('When policy is enabled, if server fails, do not change status and show error', async () => {
        suppressValidateError(1);
        fetchMockSetup({
            policy: { ...mockPolicy, isEnabled: false }
        });
        fetchMockChangeStatus(true, [], 500);
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByTestId('policy-detail-actions-button'));
        userEvent.click(screen.getByText(/enable/i));

        await waitForAsyncEvents();
        expect(screen.getByText('Disabled')).toBeVisible();
        expect(screen.getByText(/There was an error setting the enabled/i)).toBeVisible();
    });

    it('Export button downloads a file with the current time', async () => {
        fetchMockSetup();
        const dateNow = jest.spyOn(Date, 'now');
        dateNow.mockImplementation(() => new Date(2020, 10, 5).getTime());

        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        fetchMockSetup({
            triggersCount: 430,
            triggerLimit: 200,
            triggerPage: 1,
            noSort: true
        });
        fetchMockSetup({
            triggersCount: 430,
            triggerLimit: 200,
            triggerPage: 2,
            noSort: true
        });
        fetchMockSetup({
            triggersCount: 430,
            triggerLimit: 200,
            triggerPage: 3,
            noSort: true
        });

        userEvent.click(within(screen.getByTestId('trigger-toolbar-export-container')).getByRole('button'));
        userEvent.click(screen.getByText(/Export to JSON/i));

        await waitForAsyncEvents();
        expect(inBrowserDownload.mock.calls[0][1]).toEqual('policy-foo-triggers-2020-05-11.json');
        dateNow.mockRestore();
    });

    it('Export button is not found when no triggers', async () => {
        suppressValidateError(1);
        fetchMockSetup({
            triggerStatus: 404
        });
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.queryByTestId('trigger-toolbar-export-container')).not.toBeInTheDocument();
    });

    it('Trigger history does not show loading when not loading', async () => {
        fetchMockSetup();
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.queryByText('Loading Triggers')).not.toBeInTheDocument(); // Mocked the loading element
    });

    it('Trigger history shows loading when loading it', async () => {
        const finishLoading = jest.fn();
        fetchMockSetup({
            triggerLoading: finishLoading
        });
        render((
            <>
                <PolicyDetail />
            </>
        ), {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.getByText('Loading Triggers')).toBeVisible(); // Mocked the loading element

        // Prevents the timeout
        finishLoading();
        await waitForAsyncEvents();
    });

    it('Sorts date descending by default', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/date/i, {
            selector: 'th span'
            // eslint-disable-next-line testing-library/no-node-access
        }).closest('th')).toHaveAttribute('aria-sort', 'descending');
    });

    it('Allows to change the elements per page on compact (top) paginator', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByLabelText ('Items per page', {
            selector: '.pf-m-compact *'
        }));

        await waitForAsyncEvents();
        fetchMockSetup({
            triggerLimit: 10
        });
        userEvent.click(screen.getByText(/10 per page/i));

        await waitForAsyncEvents();
        expect(fetchMock.calls(/limit=10/)).toHaveLength(1);

        await waitForAsyncEvents();
        userEvent.click(screen.getByLabelText ('Items per page', {
            selector: '.pf-m-compact *'
        }));

        await waitForAsyncEvents();
        fetchMockSetup({
            triggerLimit: 100
        });
        userEvent.click(screen.getByText(/100 per page/i));

        await waitForAsyncEvents();
        expect(fetchMock.calls(/limit=100/)).toHaveLength(1);
    });

    it('Allows to change the elements per page on bottom paginator', async () => {
        fetchMockSetup();
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        userEvent.click(screen.getByLabelText ('Items per page', {
            selector: '.pf-m-bottom *'
        }));

        await waitForAsyncEvents();
        fetchMockSetup({
            triggerLimit: 10
        });
        userEvent.click(screen.getByText(/10 per page/i));

        await waitForAsyncEvents();
        expect(fetchMock.calls(/limit=10/)).toHaveLength(1);

        await waitForAsyncEvents();
        userEvent.click(screen.getByLabelText ('Items per page', {
            selector: '.pf-m-bottom *'
        }));

        await waitForAsyncEvents();
        fetchMockSetup({
            triggerLimit: 100
        });
        userEvent.click(screen.getByText(/100 per page/i));

        await waitForAsyncEvents();
        expect(fetchMock.calls(/limit=100/)).toHaveLength(1);
    });

    it('Shows loading when clicking try again button on the policy load', async () => {
        suppressValidateError(1);
        fetchMockSetup({
            policyStatus: 400
        });

        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        const finishLoading = jest.fn();
        fetchMockSetup({
            policyLoading: finishLoading
        });
        userEvent.click(screen.getByText(/try again/i));

        await waitForAsyncEvents();
        expect(screen.getByTestId('policy-loading')).toBeInTheDocument();

        finishLoading();
        await waitForAsyncEvents();
    });

    it('Shows error when trigger history fails to load', async () => {
        suppressValidateError(1);
        fetchMockSetup({
            triggerStatus: 500,
            triggers: []
        });

        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(screen.getByText(/Error when loading trigger history for policy/i)).toBeInTheDocument();
    });

    it('Shows loading when clicking try again button on the trigger history load', async () => {
        suppressValidateError(1);
        fetchMockSetup({
            triggerStatus: 500,
            triggers: []
        });

        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        const finishLoading = jest.fn();
        fetchMockSetup({
            triggerLoading: finishLoading
        });
        userEvent.click(screen.getByText(/try again/i));
        await waitForAsyncEvents();

        expect(screen.getByText('Loading Triggers')).toBeInTheDocument();

        finishLoading();
        await waitForAsyncEvents();
    });

    it('Title should be "{ name of policy } - Policies - Operations"', async () => {
        fetchMockSetup({
            policy: {
                ...mockPolicy,
                name: 'My Cool policy'
            }
        });
        render(<PolicyDetail />, {
            wrapper: getConfiguredAppWrapper({
                router: {
                    initialEntries: [ linkTo.policyDetail('foo') ]
                },
                route: {
                    path: linkTo.policyDetail(':policyId')
                }
            })
        });

        await waitForAsyncEvents();
        expect(document.title).toEqual('My Cool policy - Policies - Operations');
    });
});
