import { ErrorBoundary } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { Messages } from '../../properties/Messages';

export const ErrorPage: React.FunctionComponent = (props) => {
    return (
        <ErrorBoundary
            headerTitle={ Messages.pages.error.title }
            errorTitle={ Messages.pages.error.emptyState.title }
            errorDescription={ Messages.pages.error.emptyState.content }
        >
            { props.children }
        </ErrorBoundary>
    );
};
