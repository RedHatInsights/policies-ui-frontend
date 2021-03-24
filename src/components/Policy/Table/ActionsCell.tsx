import { Badge, Split, SplitItem, Tooltip, TooltipPosition } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';
import * as React from 'react';
import { style } from 'typestyle';

import { Messages } from '../../../properties/Messages';
import { Action, ActionType } from '../../../types/Policy/Actions';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { ActionNotificationIcon } from '../ActionIcons';

interface ActionsCellProps extends OuiaComponentProps {
    actions: Action[];
}

const ACTION_OVERFLOW = 4;

const badgeClassName = style({
    borderRadius: 3
});

const itemClassName = style({
    marginRight: 5
});

const splitClassName = style({
    minWidth: 145
});
const iconPosition = TooltipPosition.bottom;
const ActionNotificationIconTooltip = () => (
    <Tooltip
        content={ Messages.tables.policy.actions.notification }
        position={ iconPosition }
    >
        <ActionNotificationIcon />
    </Tooltip>
);
export const ActionsCell: React.FunctionComponent<ActionsCellProps> = (props) => {

    const actionsToShow = props.actions.slice(0, ACTION_OVERFLOW);
    const remain = props.actions.slice(ACTION_OVERFLOW);

    const toShow = actionsToShow.map((action, index) => {
        let element;
        switch (action.type) {
            case ActionType.NOTIFICATION:
                element = <ActionNotificationIconTooltip />;
                break;
            default:
                assertNever(action.type);
        }

        return (
            <SplitItem key={ index } className={ itemClassName }>{ element }</SplitItem>
        );
    });

    if (remain.length > 0) {
        toShow.push(
            <SplitItem key="remaining" className={ itemClassName }>
                <Badge className={ badgeClassName } isRead>{`${ remain.length } more`}</Badge>
            </SplitItem>
        );
    }

    return (
        <Split { ...getOuiaProps('Policy/Table/Actions', props) } className={ splitClassName }>{ toShow }</Split>
    );
};
