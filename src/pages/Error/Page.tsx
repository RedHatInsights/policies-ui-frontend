import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { ErrorCircleOIcon } from '@patternfly/react-icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { linkTo } from '../../Routes';
import { Expandable, Text } from '@patternfly/react-core';
import { join } from '../../utils/ComponentUtils';
import { style } from 'typestyle';
import { GlobalBackgroundColorDark300 } from '../../utils/PFColors';
import { Spacer } from '../../utils/Spacer';

type ErrorPageProps = RouteComponentProps<any>;

interface ErrorPageState {
    hasError: boolean;
    error?: any;
}

interface ErrorStackProps {
    error: any;
}

const errorClass = style({
    fontFamily: 'monospace',
    fontSize: '14px',
    fontStyle: 'default',
    textAlign: 'left',
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: GlobalBackgroundColorDark300,
    padding: Spacer.SM
});

const ErrorStack: React.FunctionComponent<ErrorStackProps> = (props) => {
    const { error } = props;

    if (error.stack) {
        return (
            <Text className={ errorClass } component="blockquote">
                { join(error.stack.split('\n'), 'br') }
            </Text>
        );
    }

    if (error.name && error.message) {
        return (
            <>
                <Text component="h6">
                    { error.name }
                </Text>
                <Text className={ errorClass } component="blockquote">
                    { error.message }
                </Text>
            </>
        );
    }

    return (
        <Text className={ errorClass } component="blockquote">
            { error.toString() }
        </Text>
    );
};

// As of time of writing, React only supports error boundaries in class components
class ErrorPageInternal extends React.Component<ErrorPageProps, ErrorPageState> {
    constructor(props: Readonly<ErrorPageProps>) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error): ErrorPageState {
        return { hasError: true, error };
    }

    goToListPage = () => {
        this.setState({
            error: undefined,
            hasError: false
        });
        this.props.history.push(linkTo.listPage());
    };

    render() {
        if (this.state.hasError) {
            return (
                <>
                    <PageHeader>
                        <PageHeaderTitle title={ Messages.pages.error.title }/>
                    </PageHeader>
                    <Main>
                        <EmptyStateSection
                            icon={ ErrorCircleOIcon }
                            title={ Messages.pages.error.emptyState.title }
                            content={ <>
                                { Messages.pages.error.emptyState.content }
                                { this.state.error && (
                                    <Expandable toggleText={ Messages.pages.error.emptyState.showDetails }>
                                        <ErrorStack error={ this.state.error } />
                                    </Expandable>
                                )}
                            </> }
                            action={ this.goToListPage }
                            actionLabel={ Messages.pages.error.emptyState.actions.goToIndex }
                        />
                    </Main>
                </>
            );
        }

        return this.props.children;
    }
}

export const ErrorPage = withRouter(ErrorPageInternal);
