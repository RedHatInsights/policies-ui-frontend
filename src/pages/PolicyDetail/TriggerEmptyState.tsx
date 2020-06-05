import * as React from 'react';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';

export const PolicyDetailTriggerEmptyState: React.FunctionComponent = () => {
    return <EmptyStateSection
        title={ Messages.pages.policyDetail.triggerEmptyState.title }
        content={ Messages.pages.policyDetail.triggerEmptyState.text }
    />;
};
