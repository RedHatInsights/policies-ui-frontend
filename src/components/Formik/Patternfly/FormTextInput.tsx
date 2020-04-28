import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, Text, TextInput as PFTextInput, TextVariants } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const FormTextInput = (props: any) => {
    const { hint, ...otherProps } = props;
    const [ field, meta ] = useField({ ...otherProps });
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
                { ...otherProps }
                { ...field }
                value={ field.value !== undefined ? field.value.toString() : '' }
                isValid={ isValid }
                onChange={ onChangePFAdapter<string | number>(field) }
            />
            { hint && <Text component={ TextVariants.small }>{ hint }</Text> }
        </FormGroup>
    );
};
