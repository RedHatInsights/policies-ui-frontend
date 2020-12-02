import * as React from 'react';

import { Messages } from '../../../properties/Messages';
import { EmptyStateSection } from '../../Policy/EmptyState/Section';

export const TriggerTableEmptyState: React.FunctionComponent = () => {
    return <EmptyStateSection
        title={ Messages.tables.trigger.emptyState.notFound.title }
        content={ Messages.tables.trigger.emptyState.notFound.content }
    />;
};
