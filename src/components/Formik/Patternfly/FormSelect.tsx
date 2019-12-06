import * as React from 'react';
import { useField } from 'formik';
import { FormSelect as PFFormSelect } from '@patternfly/react-core';

import { onChangePFAdapter } from './Common';

// Todo: Check correct typing for the props
export const FormSelect = (props: any) => {
    const [ field ] = useField({ ...props });

    return (
        <PFFormSelect { ...props } { ...field } onChange={ onChangePFAdapter<string | number>(field) }>
            { props.children }
        </PFFormSelect>
    );
};
