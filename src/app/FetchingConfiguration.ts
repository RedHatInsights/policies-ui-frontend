import { createClient, RequestInterceptor } from 'react-fetching-library';

declare const insights: any;

const refreshAuthTokenInterceptor: RequestInterceptor = (_client) => (action) => {
    return insights.chrome.auth.getUser().then(() => action);
};

export const client = createClient({
    requestInterceptors: [
        refreshAuthTokenInterceptor
    ]
});
