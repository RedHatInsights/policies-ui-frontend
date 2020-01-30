import * as React from 'react';
import { Text, Title, TitleSize } from '@patternfly/react-core';
import { style } from 'typestyle';
import { Action } from '../../../../types/Policy/Actions';

interface ConditionsProps {
    actions: Action[];
}

const titleClassName = style({
    marginBottom: 5
});

export const Conditions: React.FunctionComponent<ConditionsProps> = (_props) => {

    return (
        <>
            <Title className={ titleClassName } size={ TitleSize.md }>Actions</Title>
            <Text> Here be actions </Text>
        </>
    );
};
