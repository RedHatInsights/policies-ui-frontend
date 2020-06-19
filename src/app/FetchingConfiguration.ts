import { createClient, RequestInterceptor } from 'react-fetching-library';
import { Insights } from '../types/Insights';

declare const insights: Insights | undefined;

const refreshAuthTokenInterceptor: RequestInterceptor = (_client) => (action) => {
    if (insights) {
        return insights.chrome.auth.getUser()
        .then(() => action);
    }

    return Promise.resolve(action);
};

export const client = createClient({
    requestInterceptors: [
        refreshAuthTokenInterceptor
    ]
});
