import * as React from 'react';

import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { Messages } from '../../properties/Messages';

export const PolicyDetailTriggerEmptyState: React.FunctionComponent = () => {
    return <EmptyStateSection
        title={ Messages.pages.policyDetail.triggerEmptyState.title }
        content={ Messages.pages.policyDetail.triggerEmptyState.text }
    />;
};
