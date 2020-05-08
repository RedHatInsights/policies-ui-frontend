import { renderHook, act } from '@testing-library/react-hooks';
import { usePolicyFilter } from '../usePolicyFilter';
import { PolicyFilterColumn } from '../../types/Policy/PolicyPaging';
import { MemoryRouter, useLocation } from 'react-router-dom';

describe('src/hooks/usePolicyFilter', () => {
    it('Waits ms before updating the debouncedFilters', () => {
        jest.useFakeTimers();
        const { result } = renderHook(() => usePolicyFilter(200, false));

        act(() => {
            result.current.setFilters[PolicyFilterColumn.NAME]('foobar');
        });

        expect(result.current.debouncedFilters[PolicyFilterColumn.NAME]).toBe('');

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.debouncedFilters[PolicyFilterColumn.NAME]).toBe('foobar');
    });

    it('Saves the filter name as query param name  when saveFiltersInUrl is true', () => {
        jest.useFakeTimers();
        const { result } = renderHook(
            () => ({
                usePolicyFilter: usePolicyFilter(200, true),
                useLocation: useLocation()
            }),
            {
                wrapper: MemoryRouter
            }
        );

        expect(result.current.usePolicyFilter.debouncedFilters[PolicyFilterColumn.NAME]).toBe('');
        expect(result.current.usePolicyFilter.filters[PolicyFilterColumn.NAME]).toBe('');

        act(() => {
            result.current.usePolicyFilter.setFilters[PolicyFilterColumn.NAME]('foobar');
        });

        expect(result.current.usePolicyFilter.debouncedFilters[PolicyFilterColumn.NAME]).toBe('');
        expect(result.current.usePolicyFilter.filters[PolicyFilterColumn.NAME]).toBe('foobar');
        expect(result.current.useLocation.search).toBe('?');

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.usePolicyFilter.debouncedFilters[PolicyFilterColumn.NAME]).toBe('foobar');
        expect(result.current.useLocation.search).toBe('?name=foobar');
    });

    it('Saves the filter is_active as query param enabled when saveFiltersInUrl is true', () => {
        jest.useFakeTimers();
        const { result } = renderHook(
            () => ({
                usePolicyFilter: usePolicyFilter(200, true),
                useLocation: useLocation()
            }),
            {
                wrapper: MemoryRouter
            }
        );

        act(() => {
            result.current.usePolicyFilter.setFilters[PolicyFilterColumn.IS_ACTIVE]({
                enabled: true,
                disabled: false
            });
        });

        expect(result.current.usePolicyFilter.filters[PolicyFilterColumn.IS_ACTIVE]).toEqual({
            enabled: true,
            disabled: false
        });
        expect(result.current.useLocation.search).toBe('?');

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.useLocation.search).toBe('?enabled=1');
    });

    it('Does not save filter name as query param name when saveFiltersInUrl is false', () => {
        jest.useFakeTimers();
        const { result } = renderHook(
            () => ({
                usePolicyFilter: usePolicyFilter(200, false),
                useLocation: useLocation()
            }),
            {
                wrapper: MemoryRouter
            }
        );

        expect(result.current.usePolicyFilter.debouncedFilters[PolicyFilterColumn.NAME]).toBe('');
        expect(result.current.usePolicyFilter.filters[PolicyFilterColumn.NAME]).toBe('');

        act(() => {
            result.current.usePolicyFilter.setFilters[PolicyFilterColumn.NAME]('foobar');
        });

        expect(result.current.usePolicyFilter.debouncedFilters[PolicyFilterColumn.NAME]).toBe('');
        expect(result.current.usePolicyFilter.filters[PolicyFilterColumn.NAME]).toBe('foobar');
        expect(result.current.useLocation.search).toBe('');

        act(() => {
            jest.runAllTimers();
        });

        expect(result.current.usePolicyFilter.debouncedFilters[PolicyFilterColumn.NAME]).toBe('foobar');
        expect(result.current.useLocation.search).toBe('');
    });
});
