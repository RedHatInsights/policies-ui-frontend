import * as React from 'react';
import FlexView from 'react-flexview/lib/FlexView';
import { Button } from '@patternfly/react-core';
import { verticallySpaced } from 'csstips';
import { style } from 'typestyle';

import * as ComponentUtils from '../../utils/ComponentUtils';

interface ConditionBlockProps {
    buttonText: string;
    className: string;
    onClick: () => void;
    separatorType: React.ComponentType;
}

const styleVerticallyScaped15 = style(verticallySpaced(15));

export const ConditionBlock: React.FunctionComponent<ConditionBlockProps> = (props: React.PropsWithChildren<ConditionBlockProps>) => {
    const decoratedChildren = React.Children.map(props.children, (child) => {
        let key = null;
        if (React.isValidElement(child)) {
            key = child.props.key;
        }

        return <FlexView key={ key }><>{ child } </></FlexView>;
    });
    return (
        <FlexView column={ true } className={ `${styleVerticallyScaped15} ${props.className}` }>
            {ComponentUtils.join(decoratedChildren, props.separatorType)}
            <FlexView><Button onClick={ props.onClick }>{props.buttonText}</Button></FlexView>
        </FlexView>
    );
};
