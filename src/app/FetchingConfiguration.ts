import { createClient, RequestInterceptor } from 'react-fetching-library';
import insights from '../utils/Insights';

const refreshAuthTokenInterceptor: RequestInterceptor = (_client) => (action) => {
    return insights.chrome.auth.getUser().then(() => action);
};

export const client = createClient({
    requestInterceptors: [
        refreshAuthTokenInterceptor
    ]
});
