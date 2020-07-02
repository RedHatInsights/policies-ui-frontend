import { useDebouncedState, useUrlStateString } from 'common-code-ui';
import { assertNever } from 'common-code-ui';
import { useCallback, useMemo } from 'react';

export enum TriggerFilterColumn {
    SYSTEM = 'system'
}

export interface TriggerFilterBase<System> {
    [TriggerFilterColumn.SYSTEM]: System;
}
type Setter<T> = (val: T) => void;

export type TriggerFilters = TriggerFilterBase<string>;
export type SetTriggerFilters = TriggerFilterBase<Setter<string>>;
export type ClearFilters = (columns: Array<TriggerFilterColumn>) => void;

const DEBOUNCE_MS = 250;

const useUrlStateSystem = (defaultValue?: string) => useUrlStateString('system', defaultValue);

const useFilterBase = <System>(system: System): TriggerFilterBase<System> => {
    return useMemo(() => ({
        [TriggerFilterColumn.SYSTEM]: system
    }), [ system ]);
};

export const useTriggerFilter = (debounce = DEBOUNCE_MS) => {
    const [ filterSystem, setFilterSystem, debouncedFilterSystem ] = useDebouncedState<string>(
        '', debounce, useUrlStateSystem
    );

    const clearFilter: ClearFilters = useCallback((columns: Array<TriggerFilterColumn>) => {
        for (const column of columns) {
            switch (column) {
                case TriggerFilterColumn.SYSTEM:
                    setFilterSystem('');
                    break;
                default:
                    assertNever(column);
            }
        }
    }, [ setFilterSystem ]);

    const filters = useFilterBase(filterSystem);
    const setFilters = useFilterBase(setFilterSystem);
    const debouncedFilters = useFilterBase(debouncedFilterSystem);

    return {
        filters,
        setFilters,
        debouncedFilters,
        clearFilter
    };
};
