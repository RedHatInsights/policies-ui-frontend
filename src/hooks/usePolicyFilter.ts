import * as React from 'react';
import { useDebouncedState } from './useDebouncedState';
import {
    ClearFilterCommand, ClearFilterHandlerType, IsActiveFilter,
    PolicyFilterBase,
    PolicyFilterColumn,
    PolicyFilters,
    SetPolicyFilters
} from '../types/Policy/PolicyPaging';

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

export const usePolicyFilter = (debounce = DEBOUNCE_MS): UsePolicyFilterReturn => {

    const [ filterName, setFilterName, debouncedFilterName ] = useDebouncedState<string>(defaultName, debounce);
    const [ filterIsActive, setFilterIsActive, debouncedFilterIsActive ] = useDebouncedState<IsActiveFilter>(defaultIsActive, debounce);

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
