import * as React from 'react';
import FlexView from 'react-flexview/lib/FlexView';
import { style } from 'typestyle';

interface ConditionSeparatorProps {
    content: React.ReactNode;
}

const separatorClass = style({
    $nest: {
        '&::after': {
            content: `''`,
            backgroundColor: 'black',
            height: 1,
            position: 'relative',
            width: '100%',
            left: '0.5em',
            marginRight: '15px'
        }
    }
});

export const ConditionSeparator: React.FunctionComponent<ConditionSeparatorProps> = (props: ConditionSeparatorProps) => {
    return (
        <FlexView className={ separatorClass } vAlignContent='center'><>{ props.content }</></FlexView>
    );
};
