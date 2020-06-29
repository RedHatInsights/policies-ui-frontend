import * as React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/app/App';
import { insights } from './Insights';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { waitForAsyncEvents } from './TestUtils';
import { AppWrapper, appWrapperCleanup, appWrapperSetup } from './AppWrapper';
import fetchMock from 'fetch-mock';

describe('Smoketest', () => {
    it('Opens the main page in multiple browsers', async () => {
        (global as any).insights = insights;
        appWrapperSetup();
        fetchMock.mock();
        fetchMock.get('/api/policies/v1.0/user-config/email-preference', {
            body: [{
                fields: [{
                    name: 'immediateEmail',
                    label: 'Instant notification',
                    description: 'Immediate email for each system with triggered policies',
                    initialValue: false,
                    component: 'descriptiveCheckbox',
                    validate: []
                },
                {
                    name: 'dailyEmail',
                    label: 'Daily digest',
                    description: 'Daily summary of all systems with triggered policies in 24 hour span',
                    initialValue: false,
                    component: 'descriptiveCheckbox',
                    validate: []

                }]
            }]
        });

        fetchMock.get('/api/rbac/v1/access/?application=policies', {
            status: 200,
            body: {
                meta: {
                    count: 1, limit: 1000, offset: 0
                },
                links: {
                    first: '/api/rbac/v1/access/?application=policies&limit=1000&offset=0',
                    next: null,
                    previous: null,
                    last: '/api/rbac/v1/access/?application=policies&limit=1000&offset=0'
                },
                data: [{ resourceDefinitions: [], permission: 'policies:*:*' }]
            }
        });

        const mock = new MockAdapter(axios);
        mock.onGet('/api/rbac/v1/access/?application=policies').reply(200,
            {
                data: [
                    {
                        permission: 'policies:*:*',
                        resourceDefinitions: []
                    }
                ]
            }
        );

        fetchMock.get('/api/policies/v1.0/policies?limit=50&offset=0', {
            status: 200,
            body: {
                data: [
                    {
                        actions: '',
                        conditions: 'facts.last_boot_time',
                        ctime: '2020-06-18 15:12:33.942',
                        description: '',
                        id: 'bcda55c8-bcdb-432e-9770-4e4cc6803322',
                        isEnabled: false,
                        lastTriggered: 0,
                        mtime: '2020-06-18 15:12:33.942',
                        name: 'Copy of My first policy'
                    },
                    {
                        actions: '',
                        conditions: 'facts.last_boot_time',
                        ctime: '2020-06-18 15:10:12.067',
                        id: '0e229296-32a6-42e2-aceb-60f48e599172',
                        isEnabled: false,
                        lastTriggered: 0,
                        mtime: '2020-06-18 15:10:12.067',
                        name: 'My first policy'
                    }
                ],
                links: {
                    last: '/api/policies/v1.0/policies?limit=20&offset=0',
                    first: '/api/policies/v1.0/policies?limit=20&offset=0'
                },
                meta: {
                    count: 2
                }
            }
        });

        render(<div id="root"><App/></div>, {
            wrapper: AppWrapper
        });

        await waitForAsyncEvents();
        expect(screen.queryByText('Policies')).toBeTruthy();
        appWrapperCleanup();
    });
});
