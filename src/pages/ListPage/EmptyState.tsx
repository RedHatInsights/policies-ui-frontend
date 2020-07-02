import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { join } from 'common-code-ui';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';

interface ListPageEmptyStateProps {
    createPolicy?: () => void;
}

const Br: React.FunctionComponent = () => <br/>;

export const ListPageEmptyState: React.FunctionComponent<ListPageEmptyStateProps> = (props) => (
    <EmptyStateSection
        icon={ CubesIcon }
        title={ Messages.pages.listPage.emptyState.title }
        content={ join(Messages.pages.listPage.emptyState.text as React.ReactNode[], Br) }
        action={ props.createPolicy }
        actionLabel={ 'Create policy' }
    />
);
