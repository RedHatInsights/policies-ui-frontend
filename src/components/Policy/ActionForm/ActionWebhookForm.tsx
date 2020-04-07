import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';
import { Text } from '@patternfly/react-core';
import { usePromiseState } from '../../../hooks/usePromiseState';
import Config from '../../../config/Config';
import { Messages } from '../../../properties/Messages';

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

export const ActionWebhookForm: React.FunctionComponent<ActionFormProps> = (_props: ActionFormProps) => {
    const hooksUrl = usePromiseState<string>(Config.pages.hooks());

    return (
        <>
            <TextWithLink
                { ...Messages.components.actionWebhookForm.paragraph1 }
                url={ hooksUrl }
            />
            <TextWithLink
                { ...Messages.components.actionWebhookForm.paragraph2 }
                url={ hooksUrl }
            />
        </>
    );
};
