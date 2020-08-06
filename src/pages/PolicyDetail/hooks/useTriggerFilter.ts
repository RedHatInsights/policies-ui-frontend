import { useFilters, useUrlStateString } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';
import { TriggerFilterColumn } from '../../../components/Trigger/Filters';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('system', defaultValue);

const useStateFactory = (column: TriggerFilterColumn) => {
    switch (column) {
        case TriggerFilterColumn.NAME:
            return useUrlStateName;
        default:
            assertNever(column);
    }
};

export const useTriggerFilter = (debounce = DEBOUNCE_MS) => useFilters(TriggerFilterColumn, debounce, useStateFactory);
