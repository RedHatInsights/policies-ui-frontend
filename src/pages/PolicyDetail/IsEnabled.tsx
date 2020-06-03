import * as React from 'react';
import { Button, ButtonVariant, Stack, StackItem } from '@patternfly/react-core';
import { style } from 'typestyle';

import { Skeleton } from '@redhat-cloud-services/frontend-components';

import { DisabledPolicyIcon, EnabledPolicyIcon } from '../../components/Icons';
import { Spacer } from '../../utils/Spacer';
import { Uuid } from '../../types/Policy/Policy';
import { useMassChangePolicyEnabledMutation } from '../../services/useMassChangePolicyEnabled';

const isEnabledTextClassname = style({
    marginLeft: Spacer.MD
});

const loadingClassname = style({
    minHeight: 60
});

interface PolicyDetailIsEnabledProps {
    policyId: Uuid;
    isEnabled: boolean;
    statusChanged: (newStatus: boolean) => void;
}

export const PolicyDetailIsEnabled: React.FunctionComponent<PolicyDetailIsEnabledProps> = (props) => {

    const changePolicyEnabled = useMassChangePolicyEnabledMutation();

    const onChangeStatus = React.useCallback(newStatus => {
        const mutate = changePolicyEnabled.mutate;
        const statusChanged = props.statusChanged;
        mutate({
            policyIds: [ props.policyId ],
            shouldBeEnabled: newStatus
        }).then(() => statusChanged(newStatus));
    }, [ props.policyId, changePolicyEnabled.mutate, props.statusChanged ]);

    const enablePolicy = React.useCallback(() => {
        onChangeStatus(true);
    },  [ onChangeStatus ]);

    const disablePolicy = React.useCallback(() => {
        onChangeStatus(false);
    },  [ onChangeStatus ]);

    if (changePolicyEnabled.loading) {
        return (
            <Stack data-testid="loading" className={ loadingClassname }>
                <StackItem>
                    <Skeleton size="sm"/>
                </StackItem>
            </Stack>
        );
    }

    const { icon, text, switchLink } = props.isEnabled ? {
        icon: <EnabledPolicyIcon/>,
        text: 'Enabled',
        switchLink: <Button onClick={ disablePolicy } variant={ ButtonVariant.link }> Disable policy </Button>
    } : {
        icon: <DisabledPolicyIcon/>,
        text: 'Disabled',
        switchLink: <Button onClick={ enablePolicy } variant={ ButtonVariant.link }> Enable policy </Button>
    };

    return (
        <Stack>
            <StackItem>
                { icon }
                <span className={ isEnabledTextClassname }>{ text }</span>
            </StackItem>
            <StackItem>
                { switchLink }
            </StackItem>
        </Stack>
    );
};
