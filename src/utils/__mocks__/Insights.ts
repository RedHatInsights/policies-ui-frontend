import { InsightsType } from '../Insights';

const on = jest.fn((type: string, callback: ((event: any) => void)) => {
    callback(new Event('fake'));
});

const mockedInsight: InsightsType = {
    chrome: {
        init: jest.fn(),
        identifyApp: jest.fn((_appId: string) => Promise.resolve()),
        on,
        isProd: false,
        isBeta: jest.fn(() => true),
        auth: {
            getUser: jest.fn(() => Promise.resolve({
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
            }))
        }
    }
};

export const waitForInsights = () => {
    return Promise.resolve(mockedInsight);
};

export const getInsights = () => mockedInsight;
