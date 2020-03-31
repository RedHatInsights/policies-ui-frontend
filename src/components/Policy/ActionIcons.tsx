import * as React from 'react';
import { EnvelopeIcon } from '@patternfly/react-icons';
import { ActionType } from '../../types/Policy/Actions';
import { assertNever } from '../../utils/Assert';
import { IconProps } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { WebhookIcon } from '../Icons/WebhookIcon';

export const ActionEmailIcon = EnvelopeIcon;
export const ActionWebhookIcon = WebhookIcon;

type ActionIconProps = {
    actionType: ActionType | undefined;
} & IconProps

export const ActionIcon: React.FunctionComponent<ActionIconProps> = (props) => {
    const { actionType, ...iconProps } = props;
    switch (actionType) {
        case ActionType.WEBHOOK:
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
