import * as React from 'react';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
// eslint-disable-next-line @typescript-eslint/camelcase
import { global_danger_color_100 } from '@patternfly/react-tokens';
import { Messages } from '../../properties/Messages';
import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { useTextFormat } from '../../hooks/useTextFormat';

interface ListPageEmptyStateProps {
    action: () => void;
    error: string;
}

export const PolicyDetailErrorState: React.FunctionComponent<ListPageEmptyStateProps> = (props) => {

    const content = useTextFormat(
        Messages.pages.policyDetail.errorState.text,
        [ props.error ]
    );

    return <EmptyStateSection
        icon={ ExclamationCircleIcon }
        iconColor={ global_danger_color_100.value }
        title={ Messages.pages.policyDetail.errorState.title }
        content={ content }
        action={ props.action }
        actionLabel={ Messages.pages.policyDetail.errorState.actionText }
    />;
};
