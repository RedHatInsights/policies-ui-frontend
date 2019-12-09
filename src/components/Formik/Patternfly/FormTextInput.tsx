import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, TextInput as PFTextInput } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const FormTextInput = (props: any) => {
    const [ field, meta ] = useField({ ...props });
    const isValid = !meta.error || !meta.touched;

    return (
        <FormGroup
            fieldId={ props.id }
            helperTextInvalid={ meta.error }
            isRequired={ props.isRequired }
            isValid={ isValid }
            label={ props.label }
        >
            <PFTextInput
                { ...props }
                { ...field }
                value={ field.value || '' }
                isValid={ isValid }
                onChange={ onChangePFAdapter<string | number>(field) }
            />
        </FormGroup>
    );
};
