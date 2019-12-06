import * as React from 'react';
import { useField } from 'formik';
import { Checkbox as PFCheckbox } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const Checkbox = (props: any) => {
    const [ field ] = useField({ ...props, type: 'checkbox' });

    return (
        <PFCheckbox isChecked={ field.checked  } { ...props } { ...field } onChange={ onChangePFAdapter<boolean>(field) } />
    );
};
