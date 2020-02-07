import { Action, ActionType } from '../../types/Policy/Actions';
import * as Yup from 'yup';
import { ActionEmailSchema, ActionSchema, ActionWebhookSchema } from './Actions';
import { ValidationError } from 'yup';

const ActionSchemaSelector: ({ type }: { type: ActionType }) => Yup.Schema<any> = ({ type }) => {
    switch (type) {
        case ActionType.EMAIL:
            return ActionEmailSchema;
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
    actions: Yup.array(Yup.lazy(ActionSchemaSelector)).test(
        'one-email',
        'Only one Email action type is allowed',
        (actions: Action[] | undefined) => {
            const emailIndexes = actions && actions.reduce<number[]>((indexes, action, index) => {
                if (action.type === ActionType.EMAIL) {
                    return indexes.concat([ index ]);
                }

                return indexes;
            }, []);
            if (!emailIndexes || emailIndexes.length <= 1) {
                return true;
            }

            const validationError = new ValidationError(
                '',
                '',
                'actions',
                ''
            );

            validationError.inner = emailIndexes.map(index => new ValidationError(
                'Only one Email action is allowed',
                'email',
                `actions.${index}.type`
            ));
            return validationError;
        }
    )
});

export const PolicyFormConditions = Yup.object().shape({
    conditions: Yup.string().required('Write a condition').trim()
});

export const PolicyFormSchema = Yup.object().concat(PolicyFormDetails).concat(PolicyFormActions).concat(PolicyFormConditions);
