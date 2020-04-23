import parseJSON from 'date-fns/parseJSON';

import {
    maxPolicyNameLength,
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

        const encodedAction = `${action.type}`;

        switch (action.type) {
            case ActionType.WEBHOOK:
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
        const [ actionType ] = action.split(' ', 2);
        switch (actionType) {
            case ActionType.WEBHOOK:
                policyAction.push({
                    type: ActionType.WEBHOOK
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

    const { mtime, ctime, lastEvaluation, ...restPolicy } = policy;

    return {
        ...restPolicy,
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
        mtime: serverPolicy.mtime ? parseJSON(serverPolicy.mtime) : new Date(),
        ctime: serverPolicy.ctime ? parseJSON(serverPolicy.ctime) : new Date(),
        lastEvaluation: (serverPolicy.lastEvaluation && serverPolicy.lastEvaluation !== '') ? parseJSON(serverPolicy.lastEvaluation) : undefined
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
        lastEvaluation: undefined,
        ctime: undefined,
        id: undefined
    };
};
