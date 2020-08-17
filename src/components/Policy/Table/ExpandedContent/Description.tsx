import * as React from 'react';
import { Text, Title  } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../../utils/getOuiaProps';

interface DescriptionProps extends OuiaComponentProps {
    description: string;
}

export const Description: React.FunctionComponent<DescriptionProps> = (props) => {
    return (
        <div { ...getOuiaProps('Policy/Table/Expanded/Description', props) }>
            <Title headingLevel="h2" size="md">Description</Title>
            <Text> { props.description } </Text>
        </div>
    );
};
