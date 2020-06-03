import * as React from 'react';
import { QueryResponse } from 'react-fetching-library';

// This will swallow payloads different than 200 or 201 for the methods using this transform.
// An alternative would be to have specific adapters for each request, pass the payload and status and let
// them transform or just pass the errors as needed.
const transformPayload = <FROM, TO>(payload: FROM | undefined, status: number | undefined, adapter: (from: FROM) => TO): TO | undefined => {
    if ((status === 200 || status === 201) && payload) {
        return adapter(payload);
    }

    return payload as any;
};

type ExpectedQueryResponse<FROM> = QueryResponse<FROM> & {
    query: (...args: Array<unknown>) => Promise<QueryResponse<FROM>>;
}

type ExpectedMutateResponse<FROM> = QueryResponse<FROM> & {
    mutate: (...args: Array<unknown>) => Promise<QueryResponse<FROM>>;
}

type UseTransformQueryResponseTypeQuery<
    FROM,
    USE_QUERY_RESPONSE_FROM extends ExpectedQueryResponse<FROM>,
    TO
    > = Omit<USE_QUERY_RESPONSE_FROM, 'payload' | 'query'> & {
    query: (...args: Parameters<USE_QUERY_RESPONSE_FROM['query']>) => Promise<QueryResponse<TO>>;
    payload: undefined | TO;
};

type UseTransformQueryResponseTypeMutation<
    FROM,
    USE_QUERY_RESPONSE_FROM extends ExpectedMutateResponse<FROM>,
    TO
    > = Omit<USE_QUERY_RESPONSE_FROM, 'payload' | 'mutate'> & {
    mutate: (...args: Parameters<USE_QUERY_RESPONSE_FROM['mutate']>) => Promise<QueryResponse<TO>>;
    payload: undefined | TO;
};

interface UseTransformQueryResponseType {
    <FROM, TO, USE_QUERY_RESPONSE_FROM extends ExpectedQueryResponse<FROM>>(queryResponse: USE_QUERY_RESPONSE_FROM, adapter: (from: FROM) => TO):
        UseTransformQueryResponseTypeQuery<FROM, USE_QUERY_RESPONSE_FROM, TO>;
    <FROM, TO, USE_MUTATE_RESPONSE_FROM extends ExpectedMutateResponse<FROM>>(queryResponse: USE_MUTATE_RESPONSE_FROM, adapter: (from: FROM) => TO):
        UseTransformQueryResponseTypeMutation<FROM, USE_MUTATE_RESPONSE_FROM, TO>;
}

const isQuery = <T>(response): response is ExpectedQueryResponse<T> => {
    return response.hasOwnProperty('query');
};

const isMutate = <T>(response): response is ExpectedMutateResponse<T> => {
    return response.hasOwnProperty('mutate');
};

export const useTransformQueryResponse: UseTransformQueryResponseType = <FROM, TO, USE_QUERY_RESPONSE_FROM>(
    queryResponse: USE_QUERY_RESPONSE_FROM,
    adapter: (from: FROM) => TO
) => {

    if (!isQuery<FROM>(queryResponse) && !isMutate<FROM>(queryResponse)) {
        throw new Error('Invalid query response provided to useTransformQueryResponse');
    }

    const response: ExpectedQueryResponse<FROM> | ExpectedMutateResponse<FROM> = queryResponse;

    const { payload, status } = response;

    const transformedPayload = React.useMemo<TO | undefined>(
        () => transformPayload(payload, status, adapter),
        [ adapter, payload, status ]
    );

    const field = isQuery(queryResponse) ? 'query' : 'mutate';
    const func = isQuery(queryResponse) ? queryResponse.query : queryResponse.mutate;

    const transformedQuery = React.useCallback((...args: Array<unknown>): Promise<QueryResponse<TO>> => {
        return func(...args).then(response => {
            return {
                ...response,
                payload: transformPayload(response.payload, response.status, adapter)
            };
        });
    }, [ func, adapter ]);

    return {
        ...queryResponse,
        payload: transformedPayload,
        [field]: transformedQuery
    };
};
