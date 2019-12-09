import * as React from 'react';
import { useField } from 'formik';
import { Checkbox as PFCheckbox, FormGroup } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const Checkbox = (props: any) => {
    const [ field, meta ] = useField({ ...props, type: 'checkbox' });
    const isValid = !meta.error || !meta.touched;

    return (
        <FormGroup
            fieldId={ props.id }
            helperTextInvalid={ meta.error }
            isRequired={ props.isRequired }
            isValid={ isValid }
            label={ props.label }
        >
            <PFCheckbox
                isChecked={ field.checked  }
                { ...props }
                { ...field }
                isValid={ isValid }
                onChange={ onChangePFAdapter<boolean>(field) }
            />
        </FormGroup>
    );
};
