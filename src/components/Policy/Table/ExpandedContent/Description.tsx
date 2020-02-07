import * as React from 'react';
import { Text, Title, TitleSize } from '@patternfly/react-core';

interface DescriptionProps {
    description: string;
}

export const Description: React.FunctionComponent<DescriptionProps> = (props) => {
    return (
        <>
            <Title size={ TitleSize.md }>Description</Title>
            <Text> { props.description } </Text>
        </>
    );
};
