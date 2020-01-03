import { capitalize, FormSelectOption } from '@patternfly/react-core';
import { FormSelect, FormTextInput } from '../../Formik/Patternfly';
import { Severity } from '../../../types/Policy';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';

export const ActionAlertForm = (props: ActionFormProps) => {
    const severityNameOrId = `${props.prefix}.severity`;
    const messageNameOrId = `${props.prefix}.message`;
    return (
        <>
            <FormSelect isDisabled={ props.isReadOnly } id={ severityNameOrId } name={ severityNameOrId } label="Severity">
                <FormSelectOption label="Select a severity level"/>
                { Object.values(Severity).map(severity => <FormSelectOption
                    key={ severity }
                    label={ capitalize(severity) }
                    value={ severity }/>)}
            </FormSelect>
            <FormTextInput isReadOnly={ props.isReadOnly } type="text" label="Message" isRequired name={ messageNameOrId } id={ messageNameOrId }/>
        </>
    );
};
