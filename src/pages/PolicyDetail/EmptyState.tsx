import * as React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { format } from 'react-string-format';
import { LinkAdapter } from '../../components/Wrappers/LinkAdapter';

interface ListPageEmptyStateProps {
    goBack: string;
    policyId: string;
}

export const PolicyDetailEmptyState: React.FunctionComponent<ListPageEmptyStateProps> = (props) => (
    <EmptyStateSection
        icon={ PlusCircleIcon }
        title={ Messages.pages.policyDetail.emptyState.title }
        content={ format(Messages.pages.policyDetail.emptyState.text, props.policyId) }
        actionNode={ <Button
            variant={ ButtonVariant.primary }
            component={ LinkAdapter }
            href={ props.goBack }
        >
            { Messages.pages.policyDetail.emptyState.backText }
        </Button> }
    />
);
