import { FormTextInput } from '../../Formik/Patternfly';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionWebhookForm = (props: ActionFormProps) => {
    const endpointNameOrId = `${props.prefix}.endpoint`;

    return (
        <>
            <FormTextInput isReadOnly={ props.isReadOnly } type="text" name={ endpointNameOrId } id={ endpointNameOrId } label="Endpoint" isRequired/>
        </>
    );
};
