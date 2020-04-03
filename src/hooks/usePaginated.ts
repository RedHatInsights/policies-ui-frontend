import { UsePaginatedQueryResponse } from '../utils/ApiUtils';
import { Action, QueryResponse, useQuery } from 'react-fetching-library';

const decorate = <T, R>(data: T, decorator: (data: T) => R) => {
    return decorator(data);
};

const decorator = <T extends QueryResponse>(response: T) => {
    const itemCount = response.headers?.get('TotalCount');
    return {
        count: (itemCount ? +itemCount : itemCount) as number,
        ...response
    };
};

export const useNewPaginatedQuery =
    <T>(action: Action, initFetch?: boolean): UsePaginatedQueryResponse<T> =>
        decorate(useQuery<T>(action,  initFetch), decorator);
