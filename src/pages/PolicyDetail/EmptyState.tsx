import { UnknownIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'react-string-format';

import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { linkTo } from '../../InsightsRoutes';
import { Messages } from '../../properties/Messages';

interface ListPageEmptyStateProps {
    policyId: string;
}

export const PolicyDetailEmptyState: React.FunctionComponent<ListPageEmptyStateProps> = (props) => {

    const navigate = useNavigate();

    const goBack = React.useCallback(() => {
        navigate(linkTo.listPage());
    }, [ navigate ]);

    return <EmptyStateSection
        icon={ UnknownIcon }
        title={ Messages.pages.policyDetail.emptyState.title }
        content={ format(Messages.pages.policyDetail.emptyState.text, props.policyId) }
        actionLabel={ Messages.pages.policyDetail.emptyState.backText }
        action={ goBack }
    />;
};
