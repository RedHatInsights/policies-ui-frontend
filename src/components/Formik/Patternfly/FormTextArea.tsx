import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, TextArea as PFTextArea } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const FormTextArea = (props: any) => {
    const [ field, meta ] = useField({ ...props });
    const isValid = !meta.error || !meta.touched;

    return (
        <FormGroup
            fieldId={ props.id }
            helperTextInvalid={ meta.error }
            isRequired={ props.isRequired }
            validated={ (isValid) ? 'default' : 'error' }
            label={ props.label }
        >
            <PFTextArea
                { ...props }
                { ...field }
                value={ field.value || '' }
                validated={ (isValid) ? 'default' : 'error' }
                onChange={ onChangePFAdapter<string | number>(field) }
            />
        </FormGroup>
    );
};
