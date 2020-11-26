import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';
import { Text } from '@patternfly/react-core';
import Config from '../../../config/Config';
import { Messages } from '../../../properties/Messages';
import { getOuiaProps } from '../../../utils/getOuiaProps';

interface TextWithLinkProps {
    head: string;
    tail: string;
    link: string;
    url?: string;
}

const TextWithLink: React.FunctionComponent<TextWithLinkProps> = (props) => {
    return (
        <Text>
            {props.head}<a href={ props.url } target='_blank' rel='noopener noreferrer' >{ props.link }</a>{props.tail}
        </Text>
    );
};

export const ActionNotificationForm: React.FunctionComponent<ActionFormProps> = (props: ActionFormProps) => {

    const hooksUrl = React.useMemo(() => Config.pages.notifications(), []);

    return (
        <div { ...getOuiaProps('Policy/Action/Hook', props) }>
            <TextWithLink
                { ...Messages.components.actionNotificationForm.paragraph1 }
                url={ hooksUrl }
            />
            <TextWithLink
                { ...Messages.components.actionNotificationForm.paragraph2 }
                url={ hooksUrl }
            />
        </div>
    );
};
