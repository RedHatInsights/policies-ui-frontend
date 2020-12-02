import { Page } from '@redhat-cloud-services/insights-common-typescript';
import { act, renderHook } from '@testing-library/react-hooks';
import fetchMock, { UNMATCHED } from 'fetch-mock';
import { suppressValidateError, validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import * as React from 'react';
import { ClientContextProvider, createClient } from 'react-fetching-library';

import { Operations } from '../../../generated/Openapi';
import { useGetListPagePolicies } from '../useGetListPagePolicies';

describe('src/hooks/usePaginated', () => {

    const Wrapper: React.FunctionComponent = (props) => {
        const client = createClient({
            responseInterceptors: [
                validateSchemaResponseInterceptor
            ]
        });

        return <ClientContextProvider client={ client }>{ props.children }</ClientContextProvider>;
    };

    const failIfNoHttpCallMatched = () => {
        const calls = fetchMock.calls(UNMATCHED).filter(c => c.isUnmatched);
        if (calls.length > 0) {
            throw new Error(`Found ${ calls.length } unmatched calls, maybe you forgot to mock? : ${calls.map(c => c.request?.url || c['0'])}`);
        }
    };

    beforeEach(() => fetchMock.restore());
    afterEach(() => failIfNoHttpCallMatched());

    it('hasPolicies is true when fetching the default page and status is 200', async () => {
        jest.useFakeTimers();
        suppressValidateError();
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator(Page.defaultPage().toQuery())
            .endpoint,
            {
                headers: {},
                status: 200
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(Page.defaultPage()),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(result.current.hasPolicies).toBe(true);
    });

    it('hasPolicies is false when fetching the default page and status is 404', async () => {
        jest.useFakeTimers();
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator(Page.defaultPage().toQuery())
            .endpoint,
            {
                headers: {},
                status: 404
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(Page.defaultPage()),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(result.current.hasPolicies).toBe(false);
    });

    it('hasPolicies is undefined before fetching', async () => {
        jest.useFakeTimers();
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator(Page.defaultPage().toQuery())
            .endpoint,
            {
                headers: {},
                status: 404
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(Page.defaultPage()),
            {
                wrapper: Wrapper
            }
        );

        expect(result.current.hasPolicies).toBe(undefined);
    });

    it('hasPolicies is undefined when fetching the default page and status is not 200 or 404', async () => {
        suppressValidateError();
        jest.useFakeTimers();
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator(Page.defaultPage().toQuery())
            .endpoint,
            {
                headers: {},
                status: 500
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(Page.defaultPage()),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(result.current.hasPolicies).toBe(undefined);
    });

    it('hasPolicies is undefined when fetching the default page and status is 200, then fetching again and status is not 200 or 404', async () => {
        jest.useFakeTimers();
        suppressValidateError();
        const matcher = Operations.GetPolicies.actionCreator(Page.defaultPage().toQuery()).endpoint;

        fetchMock.getOnce(matcher,
            {
                headers: {},
                status: 200
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(Page.defaultPage()),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(fetchMock.calls(matcher).length).toBe(1);
        expect(result.current.hasPolicies).toBe(true);

        suppressValidateError();
        fetchMock.getOnce(matcher,
            {
                headers: {},
                status: 500
            },
            {
                overwriteRoutes: true
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(fetchMock.calls(matcher).length).toBe(2);
        expect(result.current.hasPolicies).toBe(undefined);
    });

    it('hasPolicies is true when fetching the second page and status is 404 if any policy in unfiltered first page', async () => {
        jest.useFakeTimers();
        suppressValidateError();
        const secondPage = Page.of(2, Page.defaultPage().size);
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator(secondPage.toQuery())
            .endpoint,
            {
                headers: {},
                status: 404
            }
        ).getOnce(
            Operations.GetPolicies.actionCreator(Page.of(1, 1).toQuery())
            .endpoint,
            {
                headers: {},
                status: 200
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(secondPage),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(result.current.hasPolicies).toBe(true);
    });

    it('hasPolicies is false when fetching the second page and status is 404 if no policy in unfiltered first page', async () => {
        jest.useFakeTimers();
        const secondPage = Page.of(2, Page.defaultPage().size);
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator((secondPage.toQuery()))
            .endpoint,
            {
                headers: {},
                status: 404
            }
        ).getOnce(
            Operations.GetPolicies.actionCreator((Page.of(1, 1)).toQuery())
            .endpoint,
            {
                headers: {},
                status: 404
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(secondPage),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(result.current.hasPolicies).toBe(false);
    });

    it('hasPolicies is undefined when fetching the second page and status is not 200 or 404', async () => {
        jest.useFakeTimers();
        suppressValidateError();
        const secondPage = Page.of(2, Page.defaultPage().size);
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator((secondPage).toQuery())
            .endpoint,
            {
                headers: {},
                status: 500
            }
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(secondPage),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
            await jest.runAllTimers();
        });

        expect(result.current.hasPolicies).toBe(undefined);
    });

    it('hasPolicies is undefined when fetching the second page with status is 404 and query for first page yields other than 200 or 404',
        async () => {
            suppressValidateError();
            jest.useFakeTimers();
            const secondPage = Page.of(2, Page.defaultPage().size);
            fetchMock.getOnce(
                Operations.GetPolicies.actionCreator((secondPage).toQuery())
                .endpoint,
                {
                    headers: {},
                    status: 404
                }
            ).getOnce(
                Operations.GetPolicies.actionCreator((Page.of(1, 1)).toQuery())
                .endpoint,
                {
                    headers: {},
                    status: 500
                }
            );

            const { result } = renderHook(
                () => useGetListPagePolicies(secondPage),
                {
                    wrapper: Wrapper
                }
            );

            await act(async () => {
                result.current.query();
                await jest.runAllTimers();
            });

            expect(result.current.hasPolicies).toBe(undefined);
        }
    );

    it('hasPolicies is undefined when fetching the second page with status is 404 prior to fetching first page', async () => {
        jest.useFakeTimers();
        const secondPage = Page.of(2, Page.defaultPage().size);

        let resolver;
        const firstPagePromise = new Promise(resolve => {
            resolver = resolve;
        });

        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator((secondPage.toQuery()))
            .endpoint,
            {
                headers: {},
                status: 404
            }
        ).getOnce(
            Operations.GetPolicies.actionCreator((Page.of(1, 1)).toQuery())
            .endpoint,
            firstPagePromise
        );

        const { result } = renderHook(
            () => useGetListPagePolicies(secondPage),
            {
                wrapper: Wrapper
            }
        );

        await act(async () => {
            result.current.query();
        });

        expect(result.current.hasPolicies).toBe(undefined);
        await act(async () => {
            await resolver({
                headers: {},
                status: 404
            });
        });

        expect(result.current.hasPolicies).toBe(false);
    });
});
