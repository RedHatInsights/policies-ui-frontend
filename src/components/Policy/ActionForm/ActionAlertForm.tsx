import { capitalize, FormGroup, FormSelectOption } from '@patternfly/react-core';
import { FormSelect, TextInput } from '../../Formik/Patternfly';
import { Severity } from '../../../types/Policy';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionAlertForm = (props: ActionFormProps) => {
    const severityNameOrId = `${props.prefix}.severity`;
    const messageNameOrId = `${props.prefix}.name`;
    return (
        <>
            <FormGroup fieldId={ severityNameOrId } label="Severity">
                <FormSelect id={ severityNameOrId } name={ severityNameOrId }>
                    <FormSelectOption label="Select a severity level"/>
                    { Object.values(Severity).map(severity => <FormSelectOption
                        key={ severity }
                        label={ capitalize(severity) }
                        value={ severity }/>)}
                </FormSelect>
            </FormGroup>
            <FormGroup fieldId={ messageNameOrId } label="Message" isRequired>
                <TextInput type="text" name={ messageNameOrId } id={ messageNameOrId }/>
            </FormGroup>
        </>
    );
};
