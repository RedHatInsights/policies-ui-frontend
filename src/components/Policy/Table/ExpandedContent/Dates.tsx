import * as React from 'react';
import { Text } from '@patternfly/react-core';
import { format } from 'date-fns';

interface DateProps {
    updated: Date;
    created: Date;
}

const dateFormatString = 'dd MMM yyyy';

export const Dates: React.FunctionComponent<DateProps> = (props) => {
    return (
        <>
            <Text>
                Last updated { format(props.updated, dateFormatString) } | Created { format(props.created, dateFormatString) }
            </Text>
        </>
    );
};
