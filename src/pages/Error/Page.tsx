// @ts-nocheck
import { ErrorBoundary } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Messages } from '../../properties/Messages';

type ErrorPageProps = RouteComponentProps<any>;

export const ErrorPageInternal: React.FunctionComponent<ErrorPageProps> = (props) => {

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

export const ErrorPage = withRouter(ErrorPageInternal);
