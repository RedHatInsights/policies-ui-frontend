import * as React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line @typescript-eslint/camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { useTextFormat } from '../../hooks/useTextFormat';

interface TriggerErrorStateProps {
    action: () => void;
    error: string;
}

export const TriggerErrorState: React.FunctionComponent<TriggerErrorStateProps> = (props) => {
    const content = useTextFormat(
        Messages.pages.policyDetail.triggerErrorState.text,
        [ props.error ]
    );

    return <EmptyStateSection
        icon={ ExclamationCircleIcon }
        iconColor={ global_danger_color_100.value }
        title={ Messages.pages.policyDetail.triggerErrorState.title }
        content={ content }
        action={ props.action }
        actionLabel={ Messages.pages.policyDetail.triggerErrorState.actionText }
    />;
};
