// This type was fetched by manual inspection and is incomplete.
// Check in your browser the `insights` global for more information.
// Is possible that there is something wrong and/or missing, but as I was using this on more than one file it seems like
// a good idea to have all the usage in a single file and define a common interface to keep track of it.
// It would be even better to add the typings to the common code or to @types.

interface Entitlement {
    is_entitled: boolean;
}

interface UserData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_org_admin: boolean;
    is_internal: boolean;
    locale: string;
}

interface Internal {
    org_id: string;
    account_id: number;
}

interface Identity {
    account_number: string;
    type: string;
    user: UserData;
    internal: Internal;
}

interface User {
    identity: Identity;
    entitlements: Record<string, Entitlement>;
}

export type InsightsType = {
    chrome: {
        init: () => void;
        identifyApp: (appId: string) => Promise<void>;
        on: (type: string, callback: ((event: any) => void)) => void;
        auth: {
            getUser: () => Promise<User>;
        };
        isProd: boolean;
        isBeta: () => boolean;
    };
};

declare const insights: InsightsType;

let insightPromise: Promise<InsightsType>;

export const waitForInsights = (): Promise<InsightsType> => {
    if (!insightPromise) {
        insightPromise = new Promise<InsightsType>(async (resolve) => {
            while (!global.hasOwnProperty('insights')) {
                await new Promise(timeout => setTimeout(timeout, 250));
            }

            resolve(insights);
        });
    }

    return insightPromise;
};

export const getInsights = (): InsightsType => insights;
