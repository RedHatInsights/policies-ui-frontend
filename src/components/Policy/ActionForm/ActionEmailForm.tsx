import { FormTextInput } from '../../Formik/Patternfly';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionEmailForm = (props: ActionFormProps) => {
    const toNameOrId = `${props.prefix}.to`;
    const subjectNameOrId = `${props.prefix}.subject`;
    const messageNameOrId = `${props.prefix}.message`;
    return (
        <>
            <FormTextInput type="text" name={ toNameOrId } id={ toNameOrId } label="Email" isRequired/>
            <FormTextInput type="text" name={ subjectNameOrId } id={ subjectNameOrId } label="Subject" isRequired/>
            <FormTextInput type="text" name={ messageNameOrId } id={ messageNameOrId } label="Message" isRequired/>
        </>
    );
};
