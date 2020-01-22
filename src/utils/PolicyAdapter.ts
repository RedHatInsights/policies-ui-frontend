import { Policy, ServerPolicy } from '../types/Policy/Policy';
import { ActionType } from '../types/Policy/Actions';

const assertUnreachable = (_x: never): never => {
    throw new Error('Unreachable');
};

export const toServerPolicy = (policy: Policy): ServerPolicy => {

    return {
        ...policy,
        actions: policy.actions?.map((action): string => {
            let encodedAction = `${action.type} `;

            switch (action.type) {
                case ActionType.ALERT:
                    encodedAction += `${action.severity}:${action.message}`;
                    break;
                case ActionType.WEBHOOK:
                    encodedAction += action.endpoint;
                    break;
                case ActionType.EMAIL:
                    encodedAction += `${action.to}:${action.subject}:${action.message}`;
                    break;
                case ActionType.SMS:
                    encodedAction += `${action.number}:${action.message}`;
                    break;
                case ActionType.SLACK:
                    encodedAction += `${action.account}:${action.room}:${action.token}`;
                    break;
                default:
                    assertUnreachable(action); // Guards in case we forget an enum
            }

            return encodedAction;
        }).join(';')
    };
};
