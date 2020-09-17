import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { actionBuilder } from 'openapi2typescript/react-fetching-library';
import { useNewPaginatedQuery } from '../usePaginated';
import fetchMock from 'fetch-mock';
import { ClientContextProvider, createClient } from 'react-fetching-library';

describe('src/hooks/usePaginated', () => {

    const Wrapper: React.FunctionComponent = (props) => {
        return <ClientContextProvider client={ createClient() }>{ props.children }</ClientContextProvider>;
    };

    it('Sets count to undefined if TotalCount header not found', async () => {
        jest.useFakeTimers();
        fetchMock.get('http://localhost', {
            headers: {
                NotTotalCount: 'stuff'
            }
        });

        const { result } = renderHook(
            () => useNewPaginatedQuery(actionBuilder('GET', 'http://localhost').build()),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        expect(result.current.count).toBe(null);
        fetchMock.restore();
    });

    it('Sets count to 5 if TotalCount header is "5"', async () => {
        jest.useFakeTimers();
        fetchMock.get('http://localhost', {
            headers: {
                TotalCount: '5'
            }
        });

        const { result } = renderHook(
            () => useNewPaginatedQuery(actionBuilder('GET', 'http://localhost').build()),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        expect(result.current.count).toBe(5);
        fetchMock.restore();
    });
});
