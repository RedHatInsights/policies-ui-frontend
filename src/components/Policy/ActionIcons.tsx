import { EnvelopeIcon } from '@patternfly/react-icons';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import { assertNever } from 'assert-never';
import * as React from 'react';

import { ActionType } from '../../types/Policy/Actions';
import { NotificationIcon } from '../Icons';

export const ActionEmailIcon = EnvelopeIcon;
export const ActionNotificationIcon = NotificationIcon;

type ActionIconProps = {
    actionType: ActionType | undefined;
} & SVGIconProps

export const ActionIcon: React.FunctionComponent<ActionIconProps> = (props) => {
    const { actionType, ...iconProps } = props;
    switch (actionType) {
        case ActionType.NOTIFICATION:
            return <ActionNotificationIcon { ...iconProps } />;
        case ActionType.EMAIL:
            return <ActionEmailIcon { ...iconProps } />;
        case undefined:
            break;
        default:
            assertNever(actionType);
    }

    return null;
};
