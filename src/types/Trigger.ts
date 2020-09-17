import * as Generated from '../generated/Openapi';

export type ServerTrigger = Generated.Schemas.HistoryItem;

export interface Trigger {
    id: string;
    hostName: string;
    created: Date;
}

export interface PagedTrigger {
    data: Array<Trigger>;
    count: number;
}

export type PagedServerTriggerResponse = Generated.Schemas.PagedResponseOfHistoryItem;
