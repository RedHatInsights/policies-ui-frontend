import * as React from 'react';
import { ActionType } from '../../../types/Policy/Actions';
import { ActionFormProps } from './ActionFormProps';
import { ActionEmailForm } from './ActionEmailForm';
import { ActionNotificationForm } from './ActionNotificationForm';

export const ActionForm = (props: ActionFormProps) => {
    const actionType = props.action?.type || undefined;
    switch (actionType) {
        case ActionType.EMAIL:
            return <ActionEmailForm { ...props }/>;
        case ActionType.NOTIFICATION:
            return <ActionNotificationForm { ...props }/>;
        case undefined:
            return null;
        default:
            throw new Error('Unexpected action type:[' + props.action?.type + ']');
    }
};
