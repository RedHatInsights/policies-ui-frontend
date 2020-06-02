import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';

export const PolicyDetailTriggerEmptyState: React.FunctionComponent = () => {
    return <EmptyStateSection
        icon={ CubesIcon }
        title={ Messages.pages.policyDetail.triggerEmptyState.title }
        content={ Messages.pages.policyDetail.triggerEmptyState.text }
    />;
};
