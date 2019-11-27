import * as React from 'react';
import { style } from 'typestyle';

import { ConditionSeparator } from './ConditionSeparator';
import { ConditionBlock } from './ConditionBlock';

const andBlockClassName = style({
    backgroundColor: '#ffffff',
    padding: '15px',
    width: '690px'
});

interface AndBlockProps {
    addCondition: () => void;
}

const AndSeparator = () => {
    return <ConditionSeparator content="AND"/>;
};

export const AndBlock: React.FunctionComponent<AndBlockProps> = (props: React.PropsWithChildren<AndBlockProps>) => {
    return <ConditionBlock
        buttonText="+ Add condition"
        className={ andBlockClassName }
        onClick={ props.addCondition }
        separatorType={ AndSeparator }
    >{ props.children }</ConditionBlock>;
};
