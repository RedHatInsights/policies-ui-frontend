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
}

export const usePolicyFilter = (debounce = DEBOUNCE_MS): UsePolicyFilterReturn => {

    const [ filterName, setFilterName, debouncedFilterName ] = useDebouncedState<string>('', debounce);
    const [ filterIsActive, setFilterIsActive, debouncedFilterIsActive ] = useDebouncedState<IsActiveFilter>({
        enabled: false,
        disabled: false
    }, debounce);

    const clearFilterHandler = React.useCallback((clearFilterCommands: ClearFilterCommand[]) => {
        for (const clearFilterCommand of clearFilterCommands) {
            switch (clearFilterCommand.filter) {
                case PolicyFilterColumn.NAME:
                    setFilterName(clearFilterCommand.data as string);
                    break;
                case PolicyFilterColumn.IS_ACTIVE:
                    setFilterIsActive(clearFilterCommand.data as IsActiveFilter);
                    break;
            }
        }
    }, [ setFilterName, setFilterIsActive ]);

    const filters = usePolicyFilterBase(filterName, filterIsActive);
    const setFilters = usePolicyFilterBase(setFilterName, setFilterIsActive);
    const debouncedFilters = usePolicyFilterBase(debouncedFilterName, debouncedFilterIsActive);

    return {
        filters,
        setFilters,
        debouncedFilters,
        clearFilterHandler
    };
};
