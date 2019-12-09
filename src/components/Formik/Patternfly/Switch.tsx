import * as React from 'react';
import { useField } from 'formik';
import { FormGroup, Switch as PFSwitch } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const Switch = (props: any) => {
    const [ field, meta ] = useField({ ...props, type: 'checkbox' });
    const { labelOn: label, ...restProps } = props;
    const isValid = !meta.error || !meta.touched;

    return (
        <FormGroup
            fieldId={ props.id }
            helperTextInvalid={ meta.error }
            isRequired={ props.isRequired }
            isValid={ isValid }
            label={ props.label }
        >
            <PFSwitch
                isChecked={ field.checked  }
                { ...restProps }
                { ...field }
                label={ label }
                onChange={ onChangePFAdapter<boolean>(field) }
            />
        </FormGroup>
    );
};
