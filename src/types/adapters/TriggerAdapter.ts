import { ServerTrigger, Trigger } from '../Trigger';
import fromUnixTime from 'date-fns/fromUnixTime';

export const toTrigger = (serverTrigger: ServerTrigger): Trigger => {
    return {
        id: serverTrigger.id || '',
        hostName: serverTrigger.hostName || '',
        created: serverTrigger.ctime ? fromUnixTime(serverTrigger.ctime / 1000) : new Date(Date.now())
    };
};

export const toTriggers = (serverTriggers: ServerTrigger[]): Trigger[] => {
    return serverTriggers.map(toTrigger);
};
