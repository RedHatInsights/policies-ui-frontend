import { ActionType } from '../../../types/Policy/Actions';
import { Text } from '@patternfly/react-core';
import * as React from 'react';
import { ActionFormProps } from './ActionFormProps';
import { ActionAlertForm } from './ActionAlertForm';
import { ActionEmailForm } from './ActionEmailForm';

export const ActionForm = (props: ActionFormProps) => {
    switch (props.action?.type) {
        case ActionType.ALERT:
            return <ActionAlertForm { ...props }/>;
        case ActionType.EMAIL:
            return <ActionEmailForm { ...props }/>;
        case undefined:
            return null;
    }

    return <Text>Not implemented yet</Text>;
};
