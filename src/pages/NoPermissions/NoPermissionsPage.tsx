import { LockIcon } from '@patternfly/react-icons';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { Messages } from '../../properties/Messages';

export const NoPermissionsPage: React.FunctionComponent = () => (
    <>
        <PageHeader>
            <PageHeaderTitle title={ Messages.pages.noPermissions.title } />
        </PageHeader>
        <section className="pf-v5-l-page__main-section pf-v5-c-page__main-section">
            <EmptyStateSection
                icon={ LockIcon }
                title={ Messages.pages.noPermissions.emptyState.title }
                content={ Messages.pages.noPermissions.emptyState.content }
            />
        </section>
    </>
);
