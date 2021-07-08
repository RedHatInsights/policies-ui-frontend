import { join } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { Messages } from '../../properties/Messages';

interface ListPageEmptyStateProps {
    createPolicy?: () => void;
}

const Br: React.FunctionComponent = () => <br />;

export const ListPageEmptyState: React.FunctionComponent<ListPageEmptyStateProps> = (props) => (
    <EmptyStateSection
        title={ Messages.pages.listPage.emptyState.title }
        content={ join(Messages.pages.listPage.emptyState.text as React.ReactNode[], Br) }
        action={ props.createPolicy }
        actionLabel={ 'Create policy' }
    />
);
