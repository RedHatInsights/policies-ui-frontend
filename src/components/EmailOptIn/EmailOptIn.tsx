import * as React from 'react';
import { Alert, AlertVariant, Text, TextContent } from '@patternfly/react-core';

import { Messages } from '../../properties/Messages';
import Config from '../../config/Config';

interface EmailOptInProps {
    content: string;
}

const emailUrl = Config.pages.emailPreferences();

export const EmailOptIn: React.FunctionComponent<EmailOptInProps> = (props) => {

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
