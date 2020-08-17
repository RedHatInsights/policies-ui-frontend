import * as React from 'react';
import { Text, Title  } from '@patternfly/react-core';
import { style } from 'typestyle';
import { Messages } from '../../../../properties/Messages';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../../utils/getOuiaProps';

interface ConditionsProps extends OuiaComponentProps {
    conditions?: string;
}

const titleClassName = style({
    marginBottom: 5
});

export const Conditions: React.FunctionComponent<ConditionsProps> = (props) => {

    return (
        <div { ...getOuiaProps('Policy/Table/Expanded/Conditions', props) }>
            <Title headingLevel="h2" className={ titleClassName } size="md">Conditions</Title>
            <Text>{ props.conditions || Messages.tables.policy.emptyState.noConditions }</Text>
        </div>
    );
};
