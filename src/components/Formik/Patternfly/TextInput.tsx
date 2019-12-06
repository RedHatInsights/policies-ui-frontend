import * as React from 'react';
import { useField } from 'formik';
import { TextInput as PFTextInput } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const TextInput = (props: any) => {
    const [ field ] = useField({ ...props });

    return (
        <PFTextInput { ...props } { ...field } value={ field.value || '' } onChange={ onChangePFAdapter<string | number>(field) } />
    );
};
