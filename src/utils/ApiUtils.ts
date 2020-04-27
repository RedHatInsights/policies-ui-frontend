import * as React from 'react';
import { QueryResponse } from 'react-fetching-library';

const transformPayload = <FROM, TO>(payload: FROM | undefined, status: number | undefined, adapter: (from: FROM) => TO): TO | undefined => {
    return status === 200 && payload ? adapter(payload) : undefined;
};

type ExpectedQueryResponse<FROM> = QueryResponse<FROM> & {
    query: (action?: any) => Promise<QueryResponse<FROM>>;
}

export const useTransformQueryResponse = <FROM, TO, USE_QUERY_RESPONSE_FROM extends ExpectedQueryResponse<FROM>>(
    queryResponse: USE_QUERY_RESPONSE_FROM,
    adapter: (from: FROM) => TO
): Omit<USE_QUERY_RESPONSE_FROM, 'payload' | 'query'> & {
    query: (...args: Parameters<USE_QUERY_RESPONSE_FROM['query']>) => Promise<QueryResponse<TO>>;
    payload: undefined | TO;
} => {
    const { payload, query, status } = queryResponse;

    const transformedQuery = React.useCallback((...args: Parameters<USE_QUERY_RESPONSE_FROM['query']>): Promise<QueryResponse<TO>> => {
        return query(...args).then(response => ({
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
