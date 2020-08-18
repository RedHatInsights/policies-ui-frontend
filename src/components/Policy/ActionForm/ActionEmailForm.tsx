import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';
import { Text } from '@patternfly/react-core';
import { Messages } from '../../../properties/Messages';
import { getInsights, InsightsEmailOptIn } from '@redhat-cloud-services/insights-common-typescript';
import { useContext } from 'react';
import { AppContext } from '../../../app/AppContext';
import { getOuiaProps } from '../../../utils/getOuiaProps';

export const ActionEmailForm: React.FunctionComponent<ActionFormProps> = (props) => {

    const appContext = useContext(AppContext);

    return (
        <div { ...getOuiaProps('Policy/Action/Email', props) }>
            <Text>
                An email will be sent to all users on this account with access to Policies according to their email preferences.
            </Text>
            { !appContext.userSettings.isSubscribedForNotifications && (
                <InsightsEmailOptIn
                    ouiaId="action-email.wizard-email-required"
                    content={ Messages.wizards.policy.actions.emailOptIn }
                    insights={ getInsights() }
                />
            )}
        </div>
    );
};
