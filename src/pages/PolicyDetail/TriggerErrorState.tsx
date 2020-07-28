import * as React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { format } from 'react-string-format';

interface TriggerErrorStateProps {
    action: () => void;
    policyId: string;
    error: string;
}

export const TriggerErrorState: React.FunctionComponent<TriggerErrorStateProps> = (props) => (
    <EmptyStateSection
        icon={ ExclamationCircleIcon }
        title={ Messages.pages.policyDetail.triggerErrorState.title }
        content={ format(Messages.pages.policyDetail.triggerErrorState.text, props.policyId, props.error) }
        action={ props.action }
        actionLabel={ Messages.pages.policyDetail.triggerErrorState.actionText }
    />
);
