import { Text, TextContent } from '@patternfly/react-core';
import { global_palette_black_600 } from '@patternfly/react-tokens';
import * as React from 'react';

import { EmptyStateSection } from '../../components/Policy/EmptyState/Section';
import { Messages } from '../../properties/Messages';

export const PolicyDetailTriggerEmptyState: React.FunctionComponent = () => {
    return <EmptyStateSection
        title={ Messages.pages.policyDetail.triggerEmptyState.title }
        content={ <TextContent>
            <Text style={ {
                color: global_palette_black_600.value
            } } >{ Messages.pages.policyDetail.triggerEmptyState.text }</Text>
            <Text component="small">{ Messages.pages.policyDetail.triggerEmptyState.sub }</Text>
        </TextContent> }
    />;
};
