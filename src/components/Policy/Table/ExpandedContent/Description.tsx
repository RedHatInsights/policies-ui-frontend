import * as React from 'react';
import { Text, Title  } from '@patternfly/react-core';

interface DescriptionProps {
    description: string;
}

export const Description: React.FunctionComponent<DescriptionProps> = (props) => {
    return (
        <>
            <Title headingLevel="h2" size="md">Description</Title>
            <Text> { props.description } </Text>
        </>
    );
};
