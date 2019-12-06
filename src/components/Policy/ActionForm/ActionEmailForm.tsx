import { FormGroup } from '@patternfly/react-core';
import { TextInput } from '../../Formik/Patternfly';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionEmailForm = (props: ActionFormProps) => {
    const toNameOrId = `${props.prefix}.to`;
    const subjectNameOrId = `${props.prefix}.subject`;
    const messageNameOrId = `${props.prefix}.message`;
    return (
        <>
            <FormGroup fieldId={ toNameOrId } label="Email" isRequired>
                <TextInput type="text" name={ toNameOrId } id={ toNameOrId }/>
            </FormGroup>
            <FormGroup fieldId={ subjectNameOrId } label="Subject" isRequired>
                <TextInput type="text" name={ subjectNameOrId } id={ subjectNameOrId }/>
            </FormGroup>
            <FormGroup fieldId={ messageNameOrId } label="Message" isRequired>
                <TextInput type="text" name={ messageNameOrId } id={ messageNameOrId }/>
            </FormGroup>
        </>
    );
};
