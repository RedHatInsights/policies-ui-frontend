import * as React from 'react';
import { Alert, AlertVariant, Text, TextContent } from '@patternfly/react-core';

import { Messages } from '../../properties/Messages';
import Config from '../../config/Config';
import { usePromiseState } from '../../hooks/usePromiseState';

interface EmailOptInProps {
    content: string;
}

export const EmailOptIn: React.FunctionComponent<EmailOptInProps> = (props) => {
    const emailUrl = usePromiseState<string>(Config.pages.emailPreferences());

    return (
        <Alert
            title={ Messages.components.emailOptIn.title }
            variant={ AlertVariant.warning }
            isInline={ true }
        >
            <TextContent>
                <Text>{ props.content }</Text>
                <Text>
                    <a href={ emailUrl } target='_blank' rel='noopener noreferrer' >{ Messages.components.emailOptIn.link }</a>
                </Text>
            </TextContent>
        </Alert>
    );
};
