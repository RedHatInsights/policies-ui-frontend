import { FormTextInput } from '../../Formik/Patternfly';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionWebhookForm = (props: ActionFormProps) => {
    const endpointNameOrId = `${props.prefix}.endpoint`;

    return (
        <>
            <FormTextInput type="text" name={ endpointNameOrId } id={ endpointNameOrId } label="Message" isRequired/>
        </>
    );
};
