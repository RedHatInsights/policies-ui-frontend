import { default as Generated, HistoryItem } from '../generated/Types';

export type ServerTrigger = HistoryItem;

export interface Trigger {
    id: string;
    hostName: string;
    created: Date;
}

export type PagedServerTriggerResponse = Generated.PagedResponseOfHistoryItem;
