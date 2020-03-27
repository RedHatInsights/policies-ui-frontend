import * as React from 'react';
import { style } from 'typestyle';

import icon from './WebhookIcon.svg';
const className = style({
    verticalAlign: '-0.125em',
    width: '1em',
    height: '1em'
});


export const WebhookIcon: React.FunctionComponent = () => {
    return (
        <img className={ className } src={ icon } />
    );
};
