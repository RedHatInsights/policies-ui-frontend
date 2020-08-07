import { ClearFilters, Filters, SetFilters } from '@redhat-cloud-services/insights-common-typescript';

export enum TriggerFilterColumn {
    NAME = 'name'
}

export type TriggerFilters = Filters<typeof TriggerFilterColumn>;
export type SetTriggerFilters = SetFilters<typeof TriggerFilterColumn>;
export type ClearTriggerFilters = ClearFilters<typeof TriggerFilterColumn>;
