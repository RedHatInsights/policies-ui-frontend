// import { ErrorBoundary } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

// import { Messages } from '../../properties/Messages';

type ErrorPageProps = any;

export const ErrorPageInternal: React.FunctionComponent<ErrorPageProps> = (props) => {

    return (
        props.children
        // <ErrorBoundary
        //     headerTitle={ Messages.pages.error.title }
        //     errorTitle={ Messages.pages.error.emptyState.title }
        //     errorDescription={ Messages.pages.error.emptyState.content }
        // >

    // </ErrorBoundary>
    );
};

export const ErrorPage = ErrorPageInternal;
