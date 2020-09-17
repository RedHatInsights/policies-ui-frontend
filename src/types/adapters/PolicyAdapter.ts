import { assertNever } from 'assert-never';
import parseJSON from 'date-fns/parseJSON';
import fromUnixTime from 'date-fns/fromUnixTime';

import {
    maxPolicyNameLength,
    NewPolicy,
    PagedServerPolicyResponse,
    Policy,
    ServerPolicyRequest,
    ServerPolicyResponse
} from '../Policy/Policy';
import { Action, ActionType } from '../Policy/Actions';
import { DeepPartial } from 'ts-essentials';

export const toServerAction = (actions: DeepPartial<Action[]>): string => {
    return actions.map((action): string => {
        if (!action || !action.type) {
            return '';
        }

        const encodedAction = `${action.type}`;

        switch (action.type) {
            case ActionType.NOTIFICATION:
                break;
            case ActionType.EMAIL:
                break;
            default:
                assertNever(action.type);
        }

        return encodedAction;
    }).join(';');
};

export const fromServerActions = (actions?: string | null): Action[] => {
    if (!actions || actions === '') {
        return [];
    }

    const policyAction: Action[] = [];
    for (const action of actions.split(';')) {
        const [ actionType ] = action.split(' ', 2);
        // Just in case the server still has the webhook, we will just skip it.
        if (actionType === 'webhook') {
            continue;
        }

        switch (actionType) {
            case ActionType.NOTIFICATION:
                policyAction.push({
                    type: ActionType.NOTIFICATION
                });
                break;
            case ActionType.EMAIL:
                policyAction.push({
                    type: ActionType.EMAIL
                });
                break;
            default:
                throw Error(`Unknown action.type=${actionType} found`);
        }
    }

    return policyAction;
};

export const toServerPolicy = (policy: DeepPartial<Policy>): ServerPolicyRequest => {

    const { mtime, ctime, ...restPolicy } = policy;

    return {
        ...restPolicy,
        name: policy.name || '',
        conditions: policy.conditions || '',
        isEnabled: policy.isEnabled !== undefined ? policy.isEnabled : false,
        actions: policy.actions ? toServerAction(policy.actions) : ''
    };
};

export const toPolicy = (serverPolicy: ServerPolicyResponse): Policy => {
    return {
        ...serverPolicy,
        id: serverPolicy.id ? serverPolicy.id : '',
        description: serverPolicy.description ? serverPolicy.description : '',
        isEnabled: serverPolicy.isEnabled ? serverPolicy.isEnabled : false,
        actions: fromServerActions(serverPolicy.actions),
        mtime: serverPolicy.mtime ? parseJSON(serverPolicy.mtime) : new Date(Date.now()),
        ctime: serverPolicy.ctime ? parseJSON(serverPolicy.ctime) : new Date(Date.now()),
        lastTriggered: serverPolicy.lastTriggered ? fromUnixTime(serverPolicy.lastTriggered / 1000) : undefined
    };
};

export const toPolicies = (serverPolicies: PagedServerPolicyResponse): Policy[] => {
    return serverPolicies.data ? serverPolicies.data.map(toPolicy) : [];
};

export const makeCopyOfPolicy = (policy: Policy): NewPolicy => {
    const prefix = 'Copy of ';
    return {
        ...policy,
        name: `${prefix}${policy.name.slice(0, maxPolicyNameLength - prefix.length)}`,
        mtime: undefined,
        lastTriggered: undefined,
        ctime: undefined,
        id: undefined
    };
};
