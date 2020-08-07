import * as React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { PFColors } from '@redhat-cloud-services/insights-common-typescript';
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
        iconColor={ PFColors.GlobalDangerColor100 }
        title={ Messages.pages.policyDetail.triggerErrorState.title }
        content={ content }
        action={ props.action }
        actionLabel={ Messages.pages.policyDetail.triggerErrorState.actionText }
    />;
};
