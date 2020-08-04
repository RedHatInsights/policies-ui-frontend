import { ClearFilters, Filters, SetFilters } from '@redhat-cloud-services/insights-common-typescript';

export enum PolicyFilterColumn {
    NAME = 'name',
    IS_ACTIVE = 'is_enabled'
}

export type PolicyFilters = Filters<typeof PolicyFilterColumn>;
export type SetPolicyFilters = SetFilters<typeof PolicyFilterColumn>;
export type ClearPolicyFilters = ClearFilters<typeof PolicyFilterColumn>;
