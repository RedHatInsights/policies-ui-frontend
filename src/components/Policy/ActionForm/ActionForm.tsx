import * as React from 'react';
import { ActionType } from '../../../types/Policy/Actions';
import { ActionFormProps } from './ActionFormProps';
import { ActionAlertForm } from './ActionAlertForm';
import { ActionEmailForm } from './ActionEmailForm';
import { ActionSlackForm } from './ActionSlackForm';
import { ActionSmsForm } from './ActionSmsForm';
import { ActionWebhookForm } from './ActionWebhookForm';

export const ActionForm = (props: ActionFormProps) => {
    switch (props.action?.type) {
        case ActionType.ALERT:
            return <ActionAlertForm { ...props }/>;
        case ActionType.EMAIL:
            return <ActionEmailForm { ...props }/>;
        case ActionType.SLACK:
            return <ActionSlackForm { ...props }/>;
        case ActionType.SMS:
            return <ActionSmsForm { ...props }/>;
        case ActionType.WEBHOOK:
            return <ActionWebhookForm { ...props }/>;
        case undefined:
            return null;
        default:
            throw new Error('Unexpected action type');
    }
};
