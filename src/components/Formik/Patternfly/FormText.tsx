import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, Text, TextVariants } from '@patternfly/react-core';

// Todo: Check correct typing for the props
export const FormText = (props: any) => {
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
            <Text component={ TextVariants.p }
                { ...props }
                { ...field }
            >
                { field.value || '' }
            </Text>
        </FormGroup>
    );
};
