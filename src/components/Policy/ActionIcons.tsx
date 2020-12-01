import * as React from 'react';
import { EnvelopeIcon } from '@patternfly/react-icons';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import { ActionType } from '../../types/Policy/Actions';
import { assertNever } from 'assert-never';
import { WebhookIcon } from '../Icons';

export const ActionEmailIcon = EnvelopeIcon;
export const ActionWebhookIcon = WebhookIcon;

type ActionIconProps = {
    actionType: ActionType | undefined;
} & SVGIconProps

export const ActionIcon: React.FunctionComponent<ActionIconProps> = (props) => {
    const { actionType, ...iconProps } = props;
    switch (actionType) {
        case ActionType.NOTIFICATION:
            return <ActionWebhookIcon { ...iconProps }/>;
        case ActionType.EMAIL:
            return <ActionEmailIcon { ...iconProps }/>;
        case undefined:
            break;
        default:
            assertNever(actionType);
    }

    return null;
};
