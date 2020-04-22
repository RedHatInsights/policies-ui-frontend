import { useTransformQueryResponse } from '../ApiUtils';
import { UseQueryResponse } from 'react-fetching-library';
import { renderHook } from '@testing-library/react-hooks';

describe('src/utils/ApiUtils', () => {
    it('transforms a queryResponse payload on status 200', () => {
        const response: UseQueryResponse<string> = {
            payload: '5',
            status: 200,
            error: false,
            loading: false,
            reset: jest.fn(),
            abort: jest.fn(),
            query: jest.fn()
        };

        const { result } = renderHook(() => useTransformQueryResponse(response, (val: string) => +val));
        expect(result.current.payload).toBe(5);
    });

    // Todo: We might need to include the error types on the query response to lift-up the only-status-200 restriction
    it('transforms payload to undefined if status is not 200', () => {
        const response: UseQueryResponse<string> = {
            payload: 'error response',
            status: 404,
            error: false,
            loading: false,
            reset: jest.fn(),
            abort: jest.fn(),
            query: jest.fn()
        };

        const { result } = renderHook(() => useTransformQueryResponse(response, (val: string) => +val));
        expect(result.current.payload).toBe(undefined);
    });

    it('transforms query promises to use the adapters in case of status 200', async () => {
        const response: UseQueryResponse<string> = {
            payload: undefined,
            status: 200,
            error: false,
            loading: false,
            reset: jest.fn(),
            abort: jest.fn(),
            query: jest.fn(() => Promise.resolve({
                payload: '33',
                status: 200,
                error: false
            }))
        };

        const { result } = renderHook(() => useTransformQueryResponse(response, (val: string) => +val));
        const queryResponse = await result.current.query();

        return expect(queryResponse.payload).toBe(33);
    });

    it('transforms query promises to return undefined if status is not 200', async () => {
        const response: UseQueryResponse<string> = {
            payload: undefined,
            status: undefined,
            error: false,
            loading: false,
            reset: jest.fn(),
            abort: jest.fn(),
            query: jest.fn(() => Promise.resolve({
                payload: '33',
                status: 404,
                error: false
            }))
        };

        const { result } = renderHook(() => useTransformQueryResponse(response, (val: string) => +val));
        const queryResponse = await result.current.query();

        return expect(queryResponse.payload).toBe(undefined);
    });

});
