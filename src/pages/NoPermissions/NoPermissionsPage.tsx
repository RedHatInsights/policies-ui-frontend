import { LockIcon } from '@patternfly/react-icons';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { Messages } from '../../properties/Messages';

export const NoPermissionsPage: React.FunctionComponent = () => (
    <>
        <PageHeader>
            <PageHeaderTitle title={ Messages.pages.noPermissions.title } />
        </PageHeader>
        <Main>
            <EmptyStateSection
                icon={ LockIcon }
                title={ Messages.pages.noPermissions.emptyState.title }
                content={ Messages.pages.noPermissions.emptyState.content }
            />
        </Main>
    </>
);
