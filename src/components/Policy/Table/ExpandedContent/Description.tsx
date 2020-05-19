import { FormGroup, Text, Form } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { Messages } from '../../../../properties/Messages';
import { getOuiaProps } from '../../../../utils/getOuiaProps';

interface DescriptionProps extends OuiaComponentProps {
    description: string;
}

export const Description: React.FunctionComponent<DescriptionProps> = (props) => {
    return (
        <div { ...getOuiaProps('Policy/Table/Expanded/Description', props) }>
            <Form>
                <FormGroup fieldId="" label={ Messages.labels.description } />
            </Form>
            <Text> { props.description } </Text>
        </div>
    );
};
