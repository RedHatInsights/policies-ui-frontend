import * as React from 'react';

type JoinType = (elements: Array<React.ReactNode>, GlueComponent: React.ElementType) => Array<React.ReactNode>;

export const join: JoinType = (elements, GlueComponent) => {
    const initialValue: Array<React.ReactNode> = [];

    return elements.reduce((joined: Array<React.ReactNode>, element, index) => {
        joined.push(element);

        if (index !== elements.length - 1) {
            joined.push((<GlueComponent key={ `${index}_joined_element` }/>));
        }

        return joined;
    }, initialValue);
};

export const joinClasses = (...args: string[]) => args.join(' ');
