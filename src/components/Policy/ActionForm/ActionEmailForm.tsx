import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';
import { Text } from '@patternfly/react-core';

export const ActionEmailForm: React.FunctionComponent<ActionFormProps> = (_props) => {
    return (
        <Text>
            An email will be sent to all users on this account with access to Custom Policies according to their email preferences.
        </Text>
    );
};
