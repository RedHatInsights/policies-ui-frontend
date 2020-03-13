import * as React from 'react';
import { QueryResponse, UseQueryResponse } from 'react-fetching-library';

export type UsePaginatedQueryResponse<T> = UseQueryResponse<T> & {
    count: number;
};

const transformPayload = <FROM, TO>(payload: FROM | undefined, status: number | undefined, adapter: (from: FROM) => TO): TO | undefined => {
    return status === 200 && payload ? adapter(payload) : undefined;
};

export const useTransformQueryResponse = <FROM, TO, USE_QUERY_RESPONSE_FROM extends UseQueryResponse<FROM> = UseQueryResponse<FROM>>(
    queryResponse: USE_QUERY_RESPONSE_FROM,
    adapter: (from: FROM) => TO
): Omit<USE_QUERY_RESPONSE_FROM, 'payload' | 'query'> & {
    query: () => Promise<QueryResponse<TO>>;
    payload: undefined | TO;
} => {
    const { payload, query, status } = queryResponse;

    const transformedQuery = React.useCallback((): Promise<QueryResponse<TO>> => {
        return query().then(response => ({
            ...response,
            payload: transformPayload(response.payload, response.status, adapter)
        }));
    }, [ query, adapter ]);

    const transformedPayload = React.useMemo<TO | undefined>(
        () => transformPayload(payload, status, adapter),
        [ adapter, payload, status ]
    );

    return {
        ...queryResponse,
        payload: transformedPayload,
        query: transformedQuery
    };
};
