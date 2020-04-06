import * as React from 'react';
import { style } from 'typestyle';
import { formatDistanceToNow, isAfter, format, add } from 'date-fns';
import { Messages } from '../../../properties/Messages';
import { EnabledPolicyIcon, DisabledPolicyIcon } from '../../Icons';

interface LastTriggeredCellProps {
    isEnabled: boolean;
    lastEvaluation: Date | undefined;
}

const lastEvaluationTextClassName = style({
    marginLeft: 10
});

export const LastTriggeredCell: React.FunctionComponent<LastTriggeredCellProps> = (props) => {
    let lastEvaluationString;
    if (props.lastEvaluation) {
        const oneMonthAfterLastTriggered = add(props.lastEvaluation, { months: 1 });
        const now = new Date(Date.now());
        if (isAfter(now, oneMonthAfterLastTriggered)) {
            lastEvaluationString = format(props.lastEvaluation, 'MMM dd y');
        } else {
            lastEvaluationString = `${formatDistanceToNow(props.lastEvaluation)} ${Messages.components.lastTriggeredCell.ago}`;
        }
    } else {
        lastEvaluationString = Messages.components.lastTriggeredCell.never;
    }

    return (
        <>
            { props.isEnabled ? <EnabledPolicyIcon/> : <DisabledPolicyIcon/>}
            <span className={ lastEvaluationTextClassName }>
                { lastEvaluationString }
            </span>
        </>
    );
};
