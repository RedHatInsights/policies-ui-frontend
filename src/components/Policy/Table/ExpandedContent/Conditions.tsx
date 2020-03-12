import * as React from 'react';
import { Text, Title, TitleSize } from '@patternfly/react-core';
import { style } from 'typestyle';
import { Messages } from '../../../../properties/Messages';

interface ConditionsProps {
    conditions?: string;
}

const titleClassName = style({
    marginBottom: 5
});

export const Conditions: React.FunctionComponent<ConditionsProps> = (props) => {

    return (
        <>
            <Title className={ titleClassName } size={ TitleSize.md }>Conditions</Title>
            <Text>{ props.conditions || Messages.tables.policy.emptyState.noConditions }</Text>
        </>
    );
};
