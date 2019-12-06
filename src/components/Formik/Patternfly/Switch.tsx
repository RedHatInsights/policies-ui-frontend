import * as React from 'react';
import { useField } from 'formik';
import { Switch as PFSwitch } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const Switch = (props: any) => {
    const [ field ] = useField({ ...props, type: 'checkbox' });

    return (
        <PFSwitch isChecked={ field.checked  } { ...props } { ...field } onChange={ onChangePFAdapter<boolean>(field) } />
    );
};
