import * as React from 'react';
import { render } from '@testing-library/react';
import App from '../src/app/App';

describe('Smoketest', () => {

    beforeAll(() => {
        console.log('before all called');
    });

    it('Opens the main page in multiple browsers', () => {
        console.log('from global', (global as any).insights);
        (window as any).insights = {
            chrome: {
                init: () => () => '', // jest.fn(),
                identifyApp: (_appId: string) => Promise.resolve(),
                on: (type: string, callback: ((event: any) => void)) => {
                    callback(new Event('fake'));
                },
                isProd: false,
                isBeta: () => true,
                auth: {
                    getUser: () => Promise.resolve({
                        identity: {
                            account_number: '123456',
                            internal: {
                                org_id: '78900',
                                account_id: 1800
                            },
                            type: 'User',
                            user: {
                                email: 'some-user@some-email.com',
                                first_name: 'First name',
                                is_active: true,
                                is_internal: true,
                                is_org_admin: false,
                                last_name: 'Last',
                                locale: 'en_US',
                                username: 'flast'
                            }
                        },
                        entitlements: {
                            ansible: {
                                is_entitled: true
                            },
                            cost_management: {
                                is_entitled: true
                            },
                            insights: {
                                is_entitled: true
                            },
                            migrations: {
                                is_entitled: false
                            },
                            openshift: {
                                is_entitled: true
                            },
                            settings: {
                                is_entitled: true
                            },
                            smart_management: {
                                is_entitled: true
                            },
                            subscriptions: {
                                is_entitled: true
                            }
                        }
                    })
                }
            }
        };

        render(<App/>);
    });
});
