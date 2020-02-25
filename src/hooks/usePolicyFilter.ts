import * as React from 'react';
import { useDebouncedState } from './useDebouncedState';
import {
    ClearFilterCommand, FilterColumn,
    IsActiveFilter
} from '../components/Policy/TableToolbar/PolicyTableToolbar';

const DEBOUNCE_MS = 250;

interface PolicyFilterBase<Name, Description, Active> {
    [FilterColumn.NAME]: Name;
    [FilterColumn.DESCRIPTION]: Description;
    [FilterColumn.IS_ACTIVE]: Active;
}
type Setter<T> =  (val: T) => void;

const usePolicyFilterBase =
    <Name, Description, Active>(name: Name, description: Description, active: Active):
        PolicyFilterBase<Name, Description, Active> => {
        return React.useMemo(() => ({
            [FilterColumn.NAME]: name,
            [FilterColumn.DESCRIPTION]: description,
            [FilterColumn.IS_ACTIVE]: active
        }), [ name, description, active ]);
    };

export type PolicyFilters = PolicyFilterBase<string, string, IsActiveFilter>;
export type SetPolicyFilters = PolicyFilterBase<Setter<string>, Setter<string>, Setter<IsActiveFilter>>;

// Todo: Simplify this, we only need the FilterColumn
type ClearFilterHandlerType = (commands: ClearFilterCommand[]) => void;

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
                case FilterColumn.NAME:
                    setFilterName(clearFilterCommand.data as string);
                    break;
                case FilterColumn.DESCRIPTION:
                    setFilterDescription(clearFilterCommand.data as string);
                    break;
                case FilterColumn.IS_ACTIVE:
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
