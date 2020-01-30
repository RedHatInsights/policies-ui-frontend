import * as React from 'react';
import { QueryResponse, UseQueryResponse } from 'react-fetching-library';

export type UsePaginatedQueryResponse<T> = UseQueryResponse<T> & {
    count: number;
};

export const useTransformPaginatedQueryResponse = <FROM, TO>(
    paginatedQueryResponse: UsePaginatedQueryResponse<FROM>,
    adapter: (from: FROM) => TO
): UsePaginatedQueryResponse<TO> => {
    const { payload, query } = paginatedQueryResponse;

    const transformedQuery = React.useCallback((): Promise<QueryResponse<TO>> => {
        return query().then(response => ({
            ...response,
            payload: !response.payload ? undefined : adapter(response.payload)
        }));
    }, [ query, adapter ]);

    const transformedPayload = React.useMemo<TO | undefined>(
        () => !payload ? undefined : adapter(payload),
        [ adapter, payload ]
    );

    return {
        ...paginatedQueryResponse,
        payload: transformedPayload,
        query: transformedQuery
    };
};
