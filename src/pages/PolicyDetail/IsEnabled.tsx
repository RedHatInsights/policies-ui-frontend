import { Skeleton, Stack, StackItem } from '@patternfly/react-core';
// eslint-disable-next-line @typescript-eslint/camelcase
import { global_spacer_md } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { DisabledPolicyIcon, EnabledPolicyIcon } from '../../components/Icons';

const isEnabledTextClassname = style({
    marginLeft: global_spacer_md.var
});

interface PolicyDetailIsEnabledProps {
    isEnabled: boolean;
    loading: boolean;
}

export const PolicyDetailIsEnabled: React.FunctionComponent<PolicyDetailIsEnabledProps> = (props) => {

    if (props.loading) {
        return (
            <Stack data-testid="loading">
                <StackItem>
                    <Skeleton width="140px" />
                </StackItem>
            </Stack>
        );
    }

    const { icon, text } = props.isEnabled ? {
        icon: <EnabledPolicyIcon />,
        text: 'Enabled'
    } : {
        icon: <DisabledPolicyIcon />,
        text: 'Disabled'
    };

    return (
        <Stack>
            <StackItem>
                { icon }
                <span className={ isEnabledTextClassname }>{ text }</span>
            </StackItem>
        </Stack>
    );
};
