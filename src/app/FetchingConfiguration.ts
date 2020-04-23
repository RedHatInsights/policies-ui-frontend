import { createClient, RequestInterceptor } from 'react-fetching-library';
import { getInsights } from '../utils/Insights';

const refreshAuthTokenInterceptor: RequestInterceptor = (_client) => (action) => {
    return getInsights().chrome.auth.getUser()
    .then(() => action);
};

export const client = createClient({
    requestInterceptors: [
        refreshAuthTokenInterceptor
    ]
});
