import {
    useFilters, useUrlStateMultipleOptions,
    useUrlStateString
} from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';

import { PolicyFilterColumn } from '../types/Policy/Filters';

const DEBOUNCE_MS = 250;

const useUrlStateName = (defaultValue?: string) => useUrlStateString('name', defaultValue);
const useUrlStateEnabled = (_defaultValue?: Array<string>) => useUrlStateMultipleOptions('enabled', [ 'Enabled', 'Disabled', '' ]);

const useStateFactory = (column: PolicyFilterColumn) => {
    switch (column) {
        case PolicyFilterColumn.NAME:
            return useUrlStateName;
        case PolicyFilterColumn.IS_ACTIVE:
            return useUrlStateEnabled;
        default:
            assertNever(column);
    }
};

export const usePolicyFilter = (debounce = DEBOUNCE_MS, saveFilterInUrl = true) => {
    return useFilters(PolicyFilterColumn, debounce, saveFilterInUrl ? useStateFactory : undefined);
};

export type UsePolicyFilterReturn = ReturnType<typeof usePolicyFilter>;
