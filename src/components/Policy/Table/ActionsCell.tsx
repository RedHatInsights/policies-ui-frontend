import * as React from 'react';
import { Action, ActionType } from '../../../types/Policy/Actions';
import { assertNever } from '../../../utils/Assert';
import { EnvelopeIcon, HashtagIcon } from '@patternfly/react-icons';
import { Badge, Split, SplitItem } from '@patternfly/react-core';
import { style } from 'typestyle';

interface ActionsCellProps {
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

export const ActionsCell: React.FunctionComponent<ActionsCellProps> = (props) => {

    const actionsToShow = props.actions.slice(0, ACTION_OVERFLOW);
    const remain = props.actions.slice(ACTION_OVERFLOW);

    const toShow = actionsToShow.map((action, index) => {
        let element;
        switch (action.type) {
            case ActionType.EMAIL:
                element = <EnvelopeIcon/>;
                break;
            case ActionType.WEBHOOK:
                element = <HashtagIcon/>;
                break;
            default:
                assertNever(action);
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
        <Split className={ splitClassName }>{ toShow }</Split>
    );
};
