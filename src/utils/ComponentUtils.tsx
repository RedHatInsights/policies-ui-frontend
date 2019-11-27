import * as React from 'react';

export const join = (elements: React.ReactElement<any>[], GlueComponent: React.ComponentType) => {
    const initialValue: React.ReactElement[] = [];
    return elements.reduce((joined, element, index) => {
        joined.push(element);

        let key = null;
        if (React.isValidElement<any>(element)) {
            key = element.props.key;
        }

        if (!key) {
            key = index;
        }

        if (index !== elements.length - 1) {
            joined.push((<GlueComponent key={ `${key}_joined_element` }/>));
        }

        return joined;
    }, initialValue);
};
