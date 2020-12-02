import { useSort } from '@redhat-cloud-services/insights-common-typescript';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
    usePolicyFilter,
    usePolicyPage,
    usePolicyRows
} from '../../../../hooks';
import { useGetPoliciesQuery } from '../../../../services/useGetPolicies';
import { Policy } from '../../../../types/Policy';
import { CopyFromPolicy } from '../CopyFromPolicy';

describe('src/components/Policy/WizardSteps/CopyFromPolicy', () => {
    it('On render, it runs the query if payload is undefined', async () => {
        jest.useFakeTimers();
        const queryMock = jest.fn();
        const { result } = renderHook(() => {
            const policyFilter = usePolicyFilter();
            const policyPage = usePolicyPage(policyFilter.debouncedFilters, 5);
            const policySort = useSort();
            const policyQuery = {
                ...useGetPoliciesQuery(policyPage.page, false),
                query: queryMock,
                payload: undefined
            };
            const policyRows = usePolicyRows(policyQuery.payload, policyQuery.loading, 0, policyPage.page);
            return {
                policyFilter,
                policyPage,
                policySort,
                policyQuery,
                policyRows
            };
        }, {
            wrapper: MemoryRouter
        });

        render(<CopyFromPolicy
            onSelect={ jest.fn() }
            { ...result.current }
        />);

        expect(queryMock).toBeCalledTimes(1);
    });

    it('On render, it does not run the query if payload is defined', async () => {
        jest.useFakeTimers();
        let queryMock = jest.fn();
        let called = 0;
        const policies = {
            value: {
                data: [] as Array<Policy>,
                count: 0
            },
            type: 'PagedResponseOfPolicy' as 'PagedResponseOfPolicy',
            status: 200 as 200,
            errors: []
        };
        const { result } = renderHook(() => {
            const policyFilter = usePolicyFilter();
            const policyPage = usePolicyPage(policyFilter.debouncedFilters, 5);
            const policySort = useSort();
            const policiesQueryToMock = useGetPoliciesQuery(policyPage.page, false);

            called += queryMock.mock.calls.length;
            queryMock = jest.fn(policiesQueryToMock.query);

            const policyQuery = {
                ...policiesQueryToMock,
                query: queryMock,
                payload: policies
            };
            const policyRows = usePolicyRows(policyQuery.payload.value.data, policyQuery.loading, 0, policyPage.page);
            return {
                policyFilter,
                policyPage,
                policySort,
                policyQuery,
                policyRows
            };
        }, {
            wrapper: MemoryRouter
        });

        render(<CopyFromPolicy
            onSelect={ jest.fn() }
            { ...result.current }
        />);

        expect(called).toBe(0);
    });
});
