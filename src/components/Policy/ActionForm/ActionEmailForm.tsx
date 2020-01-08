import { FormTextInput } from '../../Formik/Patternfly';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionEmailForm = (props: ActionFormProps) => {
    const toNameOrId = `${props.prefix}.to`;
    const subjectNameOrId = `${props.prefix}.subject`;
    const messageNameOrId = `${props.prefix}.message`;
    return (
        <>
            <FormTextInput isReadOnly={ props.isReadOnly } type="text" name={ toNameOrId } id={ toNameOrId } label="Email" isRequired/>
            <FormTextInput isReadOnly={ props.isReadOnly } type="text" name={ subjectNameOrId } id={ subjectNameOrId } label="Subject" isRequired/>
            <FormTextInput isReadOnly={ props.isReadOnly } type="text" name={ messageNameOrId } id={ messageNameOrId } label="Message" isRequired/>
        </>
    );
};
