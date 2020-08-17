import * as React from 'react';
import { Text } from '@patternfly/react-core';
import { format } from 'date-fns';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../../utils/getOuiaProps';

interface DateProps extends OuiaComponentProps {
    updated: Date;
    created: Date;
}

const dateFormatString = 'dd MMM yyyy';

export const Dates: React.FunctionComponent<DateProps> = (props) => {
    return (
        <>
            <Text { ...getOuiaProps('Policy/Table/Expanded/Dates', props) }>
                Last updated { format(props.updated, dateFormatString) } | Created { format(props.created, dateFormatString) }
            </Text>
        </>
    );
};
