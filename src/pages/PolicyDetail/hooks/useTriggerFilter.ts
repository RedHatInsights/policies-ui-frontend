import { useDebouncedState, useUrlStateString } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';
import { useCallback, useMemo } from 'react';

export enum TriggerFilterColumn {
    NAME = 'name',
    ID = 'id'
}

export interface TriggerFilterBase<Name, Id> {
    [TriggerFilterColumn.NAME]: Name;
    [TriggerFilterColumn.ID]: Id;
}
type Setter<T> = (val: T) => void;

export type TriggerFilters = TriggerFilterBase<string, string>;
export type SetTriggerFilters = TriggerFilterBase<Setter<string>, Setter<string>>;
export type ClearFilters = (columns: Array<TriggerFilterColumn>) => void;

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('system', defaultValue);
const useUrlStateId = (defaultValue?: string) => useUrlStateString('id', defaultValue);

const useFilterBase = <Name, Id>(name: Name, id: Id): TriggerFilterBase<Name, Id> => {
    return useMemo(() => ({
        [TriggerFilterColumn.NAME]: name,
        [TriggerFilterColumn.ID]: id
    }), [ name, id ]);
};

export const useTriggerFilter = (debounce = DEBOUNCE_MS) => {
    const [ filterName, setFilterName, debouncedFilterName ] = useDebouncedState<string>(
        '', debounce, useUrlStateName
    );

    const [ filterId, setFilterId, debouncedFilterId ] = useDebouncedState<string>(
        '', debounce, useUrlStateId
    );

    const clearFilter: ClearFilters = useCallback((columns: Array<TriggerFilterColumn>) => {
        for (const column of columns) {
            switch (column) {
                case TriggerFilterColumn.NAME:
                    setFilterName('');
                    break;
                case TriggerFilterColumn.ID:
                    setFilterId('');
                    break;
                default:
                    assertNever(column);
            }
        }
    }, [ setFilterName, setFilterId ]);

    const filters = useFilterBase(filterName, filterId);
    const setFilters = useFilterBase(setFilterName, setFilterId);
    const debouncedFilters = useFilterBase(debouncedFilterName, debouncedFilterId);

    return {
        filters,
        setFilters,
        debouncedFilters,
        clearFilter
    };
};
