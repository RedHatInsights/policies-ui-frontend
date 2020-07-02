import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';
import { Text } from '@patternfly/react-core';
import { Messages } from '../../../properties/Messages';
import { EmailOptIn } from 'common-code-ui';
import { useContext } from 'react';
import { AppContext } from '../../../app/AppContext';

export const ActionEmailForm: React.FunctionComponent<ActionFormProps> = (_props) => {

    const appContext = useContext(AppContext);

    return (
        <>
            <Text>
                An email will be sent to all users on this account with access to Policies according to their email preferences.
            </Text>
            { !appContext.userSettings.isSubscribedForNotifications && (
                <EmailOptIn content={ Messages.wizards.policy.actions.emailOptIn } />
            )}
        </>
    );
};
