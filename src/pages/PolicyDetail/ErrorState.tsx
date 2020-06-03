import * as React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { format } from 'react-string-format';

interface ListPageEmptyStateProps {
    action: () => void;
    policyId: string;
    error: string;
}

export const PolicyDetailErrorState: React.FunctionComponent<ListPageEmptyStateProps> = (props) => (
    <EmptyStateSection
        icon={ ExclamationCircleIcon }
        title={ Messages.pages.policyDetail.errorState.title }
        content={ format(Messages.pages.policyDetail.errorState.text, props.policyId, props.error) }
        action={ props.action }
        actionLabel={ Messages.pages.policyDetail.errorState.actionText }
    />
);
