import * as React from 'react';
import { Stack, StackItem } from '@patternfly/react-core';
import { style } from 'typestyle';

import { Skeleton } from '@redhat-cloud-services/frontend-components';

import { DisabledPolicyIcon, EnabledPolicyIcon } from '../../components/Icons';
import { Spacer } from '@redhat-cloud-services/insights-common-typescript';

const isEnabledTextClassname = style({
    marginLeft: Spacer.MD
});

const loadingClassname = style({
    minHeight: 48
});

interface PolicyDetailIsEnabledProps {
    isEnabled: boolean;
    loading: boolean;
}

export const PolicyDetailIsEnabled: React.FunctionComponent<PolicyDetailIsEnabledProps> = (props) => {

    if (props.loading) {
        return (
            <Stack data-testid="loading" className={ loadingClassname }>
                <StackItem>
                    <Skeleton size="sm"/>
                </StackItem>
            </Stack>
        );
    }

    const { icon, text } = props.isEnabled ? {
        icon: <EnabledPolicyIcon/>,
        text: 'Enabled'
    } : {
        icon: <DisabledPolicyIcon/>,
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
