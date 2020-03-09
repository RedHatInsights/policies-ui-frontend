import parseJSON from 'date-fns/parseJSON';

import {
    NewPolicy,
    PagedServerPolicyResponse,
    Policy,
    ServerPolicyRequest,
    ServerPolicyResponse
} from '../types/Policy/Policy';
import { Action, ActionType } from '../types/Policy/Actions';
import { assertNever } from './Assert';
import { DeepPartial } from 'ts-essentials';

export const toServerAction = (actions: DeepPartial<Action[]>): string => {
    return actions.map((action): string => {
        if (!action || !action.type) {
            return '';
        }

        let encodedAction = `${action.type}`;

        switch (action.type) {
            case ActionType.WEBHOOK:
                encodedAction += ' ' + action.endpoint;
                break;
            case ActionType.EMAIL:
                break;
            default:
                assertNever(action.type);
        }

        return encodedAction;
    }).join(';');
};

export const fromServerActions = (actions?: string): Action[] => {
    if (!actions || actions === '') {
        return [];
    }

    const policyAction: Action[] = [];
    for (const action of actions.split(';')) {
        const [ actionType, actionArguments ] = action.split(' ', 2);
        switch (actionType) {
            case ActionType.WEBHOOK:
                policyAction.push({
                    type: ActionType.WEBHOOK,
                    endpoint: actionArguments
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

    return {
        ...policy,
        isEnabled: policy.isEnabled !== undefined ? policy.isEnabled : false,
        actions: policy.actions ? toServerAction(policy.actions) : '',
        mtime: policy.mtime ? policy.mtime.toJSON() : undefined
    };
};

export const toPolicy = (serverPolicy: ServerPolicyResponse): Policy => {
    return {
        ...serverPolicy,
        actions: fromServerActions(serverPolicy.actions),
        mtime: parseJSON(serverPolicy.mtime)
    };
};

export const toPolicies = (serverPolicies: PagedServerPolicyResponse): Policy[] => {
    return serverPolicies.data.map(toPolicy);
};

export const makeCopyOfPolicy = (policy: Policy): NewPolicy => {
    return {
        ...policy,
        name: `Copy of ${policy.name}`,
        mtime: undefined,
        id: undefined,
        customerid: undefined
    };
};
