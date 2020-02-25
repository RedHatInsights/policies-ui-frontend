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
    <Name, Description, Active>(name: Name, description: Description, active: Active):
        PolicyFilterBase<Name, Description, Active> => {
        return React.useMemo(() => ({
            [PolicyFilterColumn.NAME]: name,
            [PolicyFilterColumn.DESCRIPTION]: description,
            [PolicyFilterColumn.IS_ACTIVE]: active
        }), [ name, description, active ]);
    };

export interface UsePolicyFilterReturn {
    filters: PolicyFilters;
    setFilters: SetPolicyFilters;
    debouncedFilters: PolicyFilters;
    clearFilterHandler: ClearFilterHandlerType;
}

export const usePolicyFilter = (debounce = DEBOUNCE_MS): UsePolicyFilterReturn => {

    const [ filterName, setFilterName, debouncedFilterName ] = useDebouncedState<string>('', debounce);
    const [ filterDescription, setFilterDescription, debouncedFilterDescription ] = useDebouncedState<string>('', debounce);
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
                case PolicyFilterColumn.DESCRIPTION:
                    setFilterDescription(clearFilterCommand.data as string);
                    break;
                case PolicyFilterColumn.IS_ACTIVE:
                    setFilterIsActive(clearFilterCommand.data as IsActiveFilter);
                    break;
            }
        }
    }, [ setFilterName, setFilterDescription, setFilterIsActive ]);

    const filters = usePolicyFilterBase(filterName, filterDescription, filterIsActive);
    const setFilters = usePolicyFilterBase(setFilterName, setFilterDescription, setFilterIsActive);
    const debouncedFilters = usePolicyFilterBase(debouncedFilterName, debouncedFilterDescription, debouncedFilterIsActive);

    return {
        filters,
        setFilters,
        debouncedFilters,
        clearFilterHandler
    };
};
