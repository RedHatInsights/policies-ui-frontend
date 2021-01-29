import * as React from 'react';

import { PolicyRow } from '../../../components/Policy/Table/PolicyTable';
import { UsePolicyToDeleteResponse } from '../../../hooks/usePolicyToDelete';
import { UseMassChangePolicyEnabledParams } from '../../../services/useMassChangePolicyEnabled';
import { makeCopyOfPolicy } from '../../../types/adapters/PolicyAdapter';
import { PolicyWizardState } from '../ListPage';

type Params = {
    canWrite: boolean;
    openPolicyToDelete: UsePolicyToDeleteResponse['open'];
    mutateChangePolicyEnabled: (params: UseMassChangePolicyEnabledParams) => void;
    setPolicyWizardState: (params: PolicyWizardState) => void;
};

export const useTableActionResolverCallback = (params: Params) => {
    const { canWrite, openPolicyToDelete, mutateChangePolicyEnabled, setPolicyWizardState } = params;

    return React.useCallback((policy: PolicyRow) => {
        if (!canWrite) {
            return [];
        }

        return [
            {
                title: policy.isEnabled ? 'Disable' : 'Enable',
                onClick: () => {
                    mutateChangePolicyEnabled({
                        policyIds: [ policy.id ],
                        shouldBeEnabled: !policy.isEnabled
                    });
                }
            },
            {
                title: 'Edit',
                onClick: () => {
                    setPolicyWizardState({
                        isOpen: true,
                        template: policy,
                        showCreateStep: false,
                        isEditing: true
                    });
                }
            },
            {
                title: 'Duplicate',
                onClick: () => {
                    setPolicyWizardState({
                        isOpen: true,
                        template: makeCopyOfPolicy(policy),
                        showCreateStep: false,
                        isEditing: false
                    });
                }
            },
            {
                title: 'Remove',
                onClick: () => {
                    openPolicyToDelete(policy);
                }
            }
        ];
    }, [ canWrite, openPolicyToDelete, mutateChangePolicyEnabled, setPolicyWizardState ]);
};
