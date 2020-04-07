import { UsePaginatedQueryResponse } from '../utils/ApiUtils';
import { Action, useQuery } from 'react-fetching-library';

export const useNewPaginatedQuery =
    <T>(action: Action, initFetch?: boolean): UsePaginatedQueryResponse<T> => {
        const result = useQuery<T>(action, initFetch);
        const itemCount = result.headers?.get('TotalCount');
        return { count: (itemCount ? +itemCount : itemCount) as number, ...result };
    };
