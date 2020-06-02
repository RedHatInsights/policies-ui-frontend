import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';
import { EmptyStateSection } from '../../Policy/EmptyState/Section';
import { Messages } from '../../../properties/Messages';

export const TriggerTableEmptyState: React.FunctionComponent = () => {
    return <EmptyStateSection
        icon={ CubesIcon }
        title={ Messages.tables.trigger.emptyState.notFound.title }
        content={ Messages.tables.trigger.emptyState.notFound.content }
    />;
};
