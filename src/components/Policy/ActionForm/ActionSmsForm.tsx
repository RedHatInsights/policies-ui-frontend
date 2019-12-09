import { FormTextInput } from '../../Formik/Patternfly';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionSmsForm = (props: ActionFormProps) => {

    const numberNameOrId = `${props.prefix}.number`;
    const messageNameOrId = `${props.prefix}.message`;

    return (
        <>
            <FormTextInput type="number" name={ numberNameOrId } id={ numberNameOrId } label="Number" isRequired/>
            <FormTextInput type="text" name={ messageNameOrId } id={ messageNameOrId } label="Message" isRequired/>
        </>
    );
};
