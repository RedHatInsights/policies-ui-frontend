import * as React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { useTextFormat } from '../../hooks/useTextFormat';
import { PFColors } from '@redhat-cloud-services/insights-common-typescript';

interface ListPageEmptyStateProps {
    action: () => void;
    policyId: string;
    error: string;
}

export const PolicyDetailErrorState: React.FunctionComponent<ListPageEmptyStateProps> = (props) => {

    const content = useTextFormat(
        Messages.pages.policyDetail.errorState.text,
        [ props.error ]
    );

    return <EmptyStateSection
        icon={ ExclamationCircleIcon }
        iconColor={ PFColors.GlobalDangerColor100 }
        title={ Messages.pages.policyDetail.errorState.title }
        content={ content }
        action={ props.action }
        actionLabel={ Messages.pages.policyDetail.errorState.actionText }
    />;
};
