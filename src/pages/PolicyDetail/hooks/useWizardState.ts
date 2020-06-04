import * as React from 'react';
import { makeCopyOfPolicy } from '../../../types/adapters/PolicyAdapter';
import { assertNever } from '../../../utils/Assert';
import { NewPolicy, Policy } from '../../../types/Policy/Policy';
import { useCallback } from 'react';

type PolicyDetailWizardState = {
    isOpen: boolean;
    initialValue: NewPolicy | undefined;
    isEditing: boolean;
};

enum PolicyDetailWizardAction {
    EDIT,
    DUPLICATE,
    CLOSE
}

const closedState: PolicyDetailWizardState = {
    isEditing: false,
    initialValue: undefined,
    isOpen: false
};

export const useWizardState = (policy: Policy | undefined) => {
    const [ state, dispatch ] = React.useReducer((_prev, action: PolicyDetailWizardAction): PolicyDetailWizardState => {
        if (!policy) {
            return closedState;
        }

        switch (action) {
            case PolicyDetailWizardAction.CLOSE:
                return closedState;
            case PolicyDetailWizardAction.DUPLICATE:
                return {
                    isEditing: false,
                    initialValue: makeCopyOfPolicy(policy),
                    isOpen: true
                };
            case PolicyDetailWizardAction.EDIT:
                return {
                    isEditing: true,
                    initialValue: policy,
                    isOpen: true
                };
            default:
                assertNever(action);
        }

        return closedState;
    }, closedState);

    const close = useCallback(() => dispatch(PolicyDetailWizardAction.CLOSE), [ dispatch ]);
    const duplicate = useCallback(() => dispatch(PolicyDetailWizardAction.DUPLICATE), [ dispatch ]);
    const edit = useCallback(() => dispatch(PolicyDetailWizardAction.EDIT), [ dispatch ]);

    return {
        data: state,
        close,
        duplicate,
        edit
    };
};
