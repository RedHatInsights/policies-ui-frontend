import { ActionType } from '../../types/Policy/Actions';
import * as Yup from 'yup';
import {
    ActionAlertSchema,
    ActionEmailSchema, ActionSchema,
    ActionSlackSchema,
    ActionSmsSchema,
    ActionWebhookSchema
} from './Actions';

const ActionSchemaSelector: ({ type }: { type: ActionType }) => Yup.Schema<any> = ({ type }) => {
    switch (type) {
        case ActionType.ALERT:
            return ActionAlertSchema;
        case ActionType.EMAIL:
            return ActionEmailSchema;
        case ActionType.SLACK:
            return ActionSlackSchema;
        case ActionType.SMS:
            return ActionSmsSchema;
        case ActionType.WEBHOOK:
            return ActionWebhookSchema;
        case undefined:
            return ActionSchema;
    }

    throw new Error('Unknown action type. Implement the new type in the schema selector');
};

export const PolicyFormDetails = Yup.object().shape({
    description: Yup.string().notRequired().trim(),
    isEnabled: Yup.boolean().notRequired(),
    name: Yup.string().required('Write a name for this Custom policy').trim()
});

export const PolicyFormActions = Yup.object().shape({
    actions: Yup.array(Yup.lazy(ActionSchemaSelector)).required('Add at least one action')
});

export const PolicyFormConditions = Yup.object().shape({
    conditions: Yup.string().required('Write a condition').trim()
});

export const PolicyFormSchema = Yup.object().concat(PolicyFormDetails).concat(PolicyFormActions).concat(PolicyFormConditions);
