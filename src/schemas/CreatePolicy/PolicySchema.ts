import { assertNever } from 'assert-never';
import * as Yup from 'yup';

import { Action, ActionType } from '../../types/Policy/Actions';
import { isAction } from '../../types/Policy/Actions/Action';
import { maxPolicyNameLength } from '../../types/Policy/Policy';
import { ActionNotificationSchema, ActionSchema } from './Actions';

const ActionSchemaSelector = (action: Action | any | undefined): typeof ActionSchema | typeof ActionNotificationSchema => {
    if (action?.type && isAction(action)) {
        const type = action.type;
        switch (type) {
            case ActionType.NOTIFICATION:
                return ActionNotificationSchema;
            default:
                assertNever(type);
        }
    }

    return ActionSchema;
};

export const PolicyFormDetails = Yup.object().shape({
    description: Yup.string().notRequired().trim(),
    isEnabled: Yup.boolean().notRequired(),
    name: Yup.string().required('Write a name for this Policy').max(maxPolicyNameLength).trim()
});

export const PolicyFormActions = Yup.object().shape({
    actions: Yup.array(Yup.lazy(ActionSchemaSelector))
});

export const PolicyFormConditions = Yup.object().shape({
    conditions: Yup.string().required('Enter a condition for the policy.').trim()
});

export const PolicyFormSchema = Yup.object().concat(PolicyFormDetails).concat(PolicyFormActions).concat(PolicyFormConditions);
