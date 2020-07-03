import * as React from 'react';
import { Text, Title  } from '@patternfly/react-core';
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
            <Title headingLevel="h2" className={ titleClassName } size="md">Conditions</Title>
            <Text>{ props.conditions || Messages.tables.policy.emptyState.noConditions }</Text>
        </>
    );
};
