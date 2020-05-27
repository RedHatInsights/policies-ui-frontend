import * as React from 'react';
import { Text } from '@patternfly/react-core';
import { VAlignForm } from '../../../Pf/components/form/PfForm';
import { Messages } from '../../../../properties/Messages';

interface DescriptionProps {
    description: string;
}

export const Description: React.FunctionComponent<DescriptionProps> = (props) => {
    return (
        <>
            <VAlignForm title={ Messages.labels.description } />
            <Text> { props.description } </Text>
        </>
    );
};
