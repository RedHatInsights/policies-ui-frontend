import * as React from 'react';
import { useDebouncedState } from './useDebouncedState';
import { useUrlState, useUrlStateString } from './useUrlState';
import {
    ClearFilterCommand, ClearFilterHandlerType, IsActiveFilter,
    PolicyFilterBase,
    PolicyFilterColumn,
    PolicyFilters,
    SetPolicyFilters
} from '../types/Policy/PolicyPaging';
import { useState } from 'react';

const DEBOUNCE_MS = 250;

const usePolicyFilterBase =
    <Name, Active>(name: Name, active: Active):
        PolicyFilterBase<Name, Active> => {
        return React.useMemo(() => ({
            [PolicyFilterColumn.NAME]: name,
            [PolicyFilterColumn.IS_ACTIVE]: active
        }), [ name, active ]);
    };

export interface UsePolicyFilterReturn {
    filters: PolicyFilters;
    setFilters: SetPolicyFilters;
    debouncedFilters: PolicyFilters;
    clearFilterHandler: ClearFilterHandlerType;
    isClear: boolean;
}

const defaultName = '';
const defaultIsActive = {
    enabled: false,
    disabled: false
};

const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);
const useUrlStateIsActive = (defaultValue?: IsActiveFilter) => {

    const serializer = React.useCallback((value: IsActiveFilter | undefined) => {
        if (value === undefined || value.enabled === value.disabled) {
            return undefined;
        }

        return value.enabled ? '1' : '0';
    }, []);

    const deserializer = React.useCallback((value: string | undefined) => {
        const val = {
            enabled: false,
            disabled: false
        };

        if (value === '1') {
            val.enabled = true;
        } else if (value === '0') {
            val.disabled = true;
        }

        return val;
    }, []);

    return useUrlState<IsActiveFilter>('enabled', serializer, deserializer, defaultValue);
};

export const usePolicyFilter = (debounce = DEBOUNCE_MS as number, saveFiltersInUrl = true as boolean): UsePolicyFilterReturn => {

    const [ filterName, setFilterName, debouncedFilterName ] = useDebouncedState<string>(
        defaultName, debounce, saveFiltersInUrl ? useUrlStateName : undefined
    );
    const [ filterIsActive, setFilterIsActive, debouncedFilterIsActive ] = useDebouncedState<IsActiveFilter>(
        defaultIsActive, debounce, saveFiltersInUrl ? useUrlStateIsActive : undefined
    );

    const clearFilterHandler = React.useCallback((clearFilterCommands: ClearFilterCommand[]) => {
        for (const clearFilterCommand of clearFilterCommands) {
            switch (clearFilterCommand.filter) {
                case PolicyFilterColumn.NAME:
                    setFilterName(defaultName);
                    break;
                case PolicyFilterColumn.IS_ACTIVE:
                    setFilterIsActive(defaultIsActive);
                    break;
            }
        }
    }, [ setFilterName, setFilterIsActive ]);

    const filters = usePolicyFilterBase(filterName, filterIsActive);
    const setFilters = usePolicyFilterBase(setFilterName, setFilterIsActive);
    const debouncedFilters = usePolicyFilterBase(debouncedFilterName, debouncedFilterIsActive);

    const isClear = React.useMemo(() => {
        return debouncedFilterName === defaultName && debouncedFilterIsActive === defaultIsActive;
    }, [ debouncedFilterName, debouncedFilterIsActive ]);

    return {
        filters,
        setFilters,
        debouncedFilters,
        clearFilterHandler,
        isClear
    };
};
