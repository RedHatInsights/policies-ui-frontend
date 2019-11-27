import * as React from 'react';
import { style } from 'typestyle';

import { ConditionBlock } from './ConditionBlock';
import { ConditionSeparator } from './ConditionSeparator';

const orBlockClassName = style({
    backgroundColor: '#dddddd',
    padding: '15px',
    width: '620px'
});

interface OrBlockProps {
    addCondition: () => void;
}

const OrSeparator = () => {
    return <ConditionSeparator content="OR"/>;
};

export const OrBlock: React.FunctionComponent<OrBlockProps> = (props: React.PropsWithChildren<OrBlockProps>) => {
    return <ConditionBlock
        buttonText="+ OR"
        className={ orBlockClassName }
        onClick={ props.addCondition }
        separatorType={ OrSeparator }
    >{ props.children }</ConditionBlock>;
};
