import * as React from 'react';
import { Messages } from '../../properties/Messages';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { linkTo } from '../../Routes';
import { ErrorBoundaryPage } from 'common-code-ui';

type ErrorPageProps = RouteComponentProps<any>;

export const ErrorPageInternal: React.FunctionComponent<ErrorPageProps> = (props) => {
    const goToListPage = React.useCallback(() => {
        props.history.push(linkTo.listPage());
    }, [ props.history ]);

    return (
        <ErrorBoundaryPage
            action={ goToListPage }
            actionLabel={ Messages.pages.error.emptyState.actions.goToIndex }
            pageHeader={ Messages.pages.error.title }
            title={ Messages.pages.error.emptyState.title }
            description={ Messages.pages.error.emptyState.content }
        >
            { props.children }
        </ErrorBoundaryPage>
    );
};

export const ErrorPage = withRouter(ErrorPageInternal);
