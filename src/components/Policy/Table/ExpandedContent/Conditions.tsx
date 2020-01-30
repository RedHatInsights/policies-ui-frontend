import * as React from 'react';
import { Text, Title, TitleSize } from '@patternfly/react-core';
import { style } from 'typestyle';

interface ConditionsProps {
    conditions: string;
}

const titleClassName = style({
    marginBottom: 5
});

export const Conditions: React.FunctionComponent<ConditionsProps> = (props) => {

    return (
        <>
            <Title className={ titleClassName } size={ TitleSize.md }>Conditions</Title>
            <Text>{ props.conditions }</Text>
        </>
    );
};
