import { Icon } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';

export const EnabledPolicyIcon: React.FunctionComponent = () => {
    return <Icon style={ { color: 'var(--pf-v5-global--success-color--100)' } }><CheckCircleIcon /></Icon>;
};
