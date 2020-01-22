import { Middleware } from 'redux';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';

let registry: any;

export function init (...middleware: Middleware[]) {
    if (registry) {
        throw new Error('store already initialized');
    }

    registry = new ReducerRegistry({}, [
        promiseMiddleware(),
        ...middleware
    ]);

    //If you want to register all of your reducers, this is good place.
    registry.register({
        notifications
    });
    /*
     *  registry.register({
     *    someName: (state, action) => ({...state})
     *  });
     */
    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args: any[]) {
    return registry.register(...args);
}
