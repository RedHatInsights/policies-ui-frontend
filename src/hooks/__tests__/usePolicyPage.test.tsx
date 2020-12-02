import { Filter, Operator, Page } from '@redhat-cloud-services/insights-common-typescript';
import { act, renderHook } from '@testing-library/react-hooks';

import Config from '../../config/Config';
import { PolicyFilterColumn, PolicyFilters } from '../../types/Policy/Filters';
import { usePolicyPage } from '../usePolicyPage';

describe('src/hooks/usePolicyPage', () => {
    it('Default PolicyPage', () => {
        const filters: PolicyFilters = {
            [PolicyFilterColumn.NAME]: '',
            [PolicyFilterColumn.IS_ACTIVE]: ''
        };
        const defaultPage = Page.defaultPage();
        const { result } = renderHook(() => usePolicyPage(filters, Config.defaultElementsPerPage));
        const expected = Page.of(defaultPage.index, 20, new Filter());

        expect(result.current.page).toEqual(expected);
    });

    describe('Filter: name', () => {
        it('Created when using a non default value', () => {
            const filters: PolicyFilters = {
                [PolicyFilterColumn.NAME]: 'abc',
                [PolicyFilterColumn.IS_ACTIVE]: ''
            };

            const { result } = renderHook(() => usePolicyPage(filters, 20));

            expect(result.current.page.filter).toEqual(new Filter().and(
                PolicyFilterColumn.NAME,
                Operator.ILIKE,
                '%abc%'
            ));
        });

        it('Value is trimmed', () => {
            const filters: PolicyFilters = {
                [PolicyFilterColumn.NAME]: '     abc    ',
                [PolicyFilterColumn.IS_ACTIVE]: ''
            };

            const { result } = renderHook(() => usePolicyPage(filters, 20));

            expect(result.current.page.filter).toEqual(new Filter().and(
                PolicyFilterColumn.NAME,
                Operator.ILIKE,
                '%abc%'
            ));
        });
    });

    describe('Filter: is_active', () => {
        it('Not created when both values are equal (all false)', () => {
            const filters: PolicyFilters = {
                [PolicyFilterColumn.NAME]: '',
                [PolicyFilterColumn.IS_ACTIVE]: ''
            };

            const { result } = renderHook(() => usePolicyPage(filters, 20));

            expect(result.current.page.filter).toEqual(new Filter());
        });

        it('Created when both values are different, disabled: true', () => {
            const filters: PolicyFilters = {
                [PolicyFilterColumn.NAME]: '',
                [PolicyFilterColumn.IS_ACTIVE]: 'Disabled'
            };

            const { result } = renderHook(() => usePolicyPage(filters, 20));

            expect(result.current.page.filter).toEqual(new Filter().and(
                PolicyFilterColumn.IS_ACTIVE,
                Operator.BOOLEAN_IS,
                'false'
            ));
        });

        it('Created when both values are different, enabled: true', () => {
            const filters: PolicyFilters = {
                [PolicyFilterColumn.NAME]: '',
                [PolicyFilterColumn.IS_ACTIVE]: 'Enabled'
            };

            const { result } = renderHook(() => usePolicyPage(filters, 20));

            expect(result.current.page.filter).toEqual(new Filter().and(
                PolicyFilterColumn.IS_ACTIVE,
                Operator.BOOLEAN_IS,
                'true'
            ));
        });
    });

    it('Filter: mixed', () => {
        const filters: PolicyFilters = {
            [PolicyFilterColumn.NAME]: ' foo bar    abc       ',
            [PolicyFilterColumn.IS_ACTIVE]: 'Enabled'
        };

        const { result } = renderHook(() => usePolicyPage(filters, 20));

        expect(result.current.page.filter).toEqual(new Filter().and(
            PolicyFilterColumn.NAME,
            Operator.ILIKE,
            '%foo bar    abc%'
        ).and(
            PolicyFilterColumn.IS_ACTIVE,
            Operator.BOOLEAN_IS,
            'true'
        ));
    });

    it('changePage changes the current page index', () => {
        const filters: PolicyFilters = {
            [PolicyFilterColumn.NAME]: '',
            [PolicyFilterColumn.IS_ACTIVE]: ''
        };

        const { result } = renderHook(() => usePolicyPage(filters, 20));

        expect(result.current.page.index).toBe(1);

        act(() => {
            result.current.changePage(undefined, 5);
        });

        expect(result.current.page.index).toBe(5);
    });

    it('changeItemsPerPage changes the page.size', () => {
        const filters: PolicyFilters = {
            [PolicyFilterColumn.NAME]: '',
            [PolicyFilterColumn.IS_ACTIVE]: ''
        };

        const { result } = renderHook(() => usePolicyPage(filters, 111));

        expect(result.current.page.size).toBe(111);

        act(() => {
            result.current.changeItemsPerPage(undefined, 456);
        });

        expect(result.current.page.size).toBe(456);
    });

    it('page.index resets to 1 if there is a filter change', () => {
        const filters: PolicyFilters = {
            [PolicyFilterColumn.NAME]: '',
            [PolicyFilterColumn.IS_ACTIVE]: ''
        };
        const filters2: PolicyFilters = {
            [PolicyFilterColumn.NAME]: 'foo bared',
            [PolicyFilterColumn.IS_ACTIVE]: ''
        };
        const { result, rerender } = renderHook((argFilter) => usePolicyPage(argFilter, 20), {
            initialProps: filters
        });

        expect(result.current.page.index).toBe(1);

        act(() => {
            result.current.changePage(undefined, 5);
        });

        expect(result.current.page.index).toBe(5);

        act(() => {
            rerender(filters2);
        });

        expect(result.current.page.index).toBe(1);
    });
});
