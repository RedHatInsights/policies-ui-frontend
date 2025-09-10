import { Text } from '@patternfly/react-core';
import { getInsights, InsightsEmailOptIn } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useContext } from 'react';
import { format } from 'react-string-format';

import { AppContext } from '../../../app/AppContext';
import Config from '../../../config/Config';
import { Messages, useFeatureFlag } from '../../../properties/Messages';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { ActionFormProps } from './ActionFormProps';

export const ActionNotificationForm: React.FunctionComponent<ActionFormProps> = (props: ActionFormProps) => {

    const hooksUrl = React.useMemo(() => Config.pages.notifications(), []);
    const appContext = useContext(AppContext);
    const isLightspeedEnabled = useFeatureFlag('platform.lightspeed-rebrand');
    return (
        <div { ...getOuiaProps('Policy/Action/Hook', props) }>
            <Text>
                { format(
                    Messages.components.actionNotificationForm.text,
                    <a href={ hooksUrl } target="_blank" rel="noopener noreferrer">
                        { Messages.components.actionNotificationForm.link }
                    </a>
                ) }
            </Text>
            { !appContext.userSettings.isSubscribedForNotifications && (
                <InsightsEmailOptIn
                    ouiaId="action-email.wizard-email-required"
                    content={ isLightspeedEnabled ? Messages.wizards.policy.actions.emailOptInLightspeed
                        : Messages.wizards.policy.actions.emailOptIn }
                    bundle="rhel"
                    insights={ getInsights() }
                />
            )}
        </div>
    );
};
