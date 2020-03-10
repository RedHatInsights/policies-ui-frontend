import * as React from 'react';

export const join: (
    elements: React.ReactElement<unknown>[],
    GlueComponent: React.ComponentType
) => React.ReactElement<unknown>[] = (elements, GlueComponent) => {
    const initialValue: React.ReactElement[] = [];
    return elements.reduce((joined, element, index) => {
        joined.push(element);

        if (index !== elements.length - 1) {
            joined.push((<GlueComponent key={ `${index}_joined_element` }/>));
        }

        return joined;
    }, initialValue);
};

export const joinClasses = (...args: string[]) => args.join(' ');
