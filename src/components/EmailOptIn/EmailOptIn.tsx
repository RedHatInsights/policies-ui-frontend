import * as React from 'react';
import { Alert, AlertVariant, Text, TextContent } from '@patternfly/react-core';

import { Messages } from '../../properties/Messages';
import Config from '../../config/Config';
import { useContext } from 'react';
import { AppContext } from '../../app/AppContext';

interface EmailOptInProps {
    content: string;
}

export const EmailOptIn: React.FunctionComponent<EmailOptInProps> = (props) => {

    const { insights } = useContext(AppContext);
    const emailUrl = Config.pages.emailPreferences(insights);

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
