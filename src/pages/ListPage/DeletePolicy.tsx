import { addDangerNotification } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { PolicyDeleteModal } from '../../components/Policy/DeleteModal';
import { useMassDeletePoliciesMutation } from '../../services/useMassDeletePolicies';
import { Policy, Uuid } from '../../types/Policy/Policy';

export interface DeletePolicyProps {
    getPolicies?: () => Promise<Uuid[]>;
    onDeleted?: (policyId: Uuid) => void;
    onClose: (deleted: boolean) => void;
    loading: boolean;
    count: number;
    policy?: Policy;
}

export const DeletePolicy: React.FunctionComponent<DeletePolicyProps> = (props) => {

    const { onDeleted } = props;

    const { mutate, loading } = useMassDeletePoliciesMutation();

    const isLoading = loading || props.loading;

    const deletePoliciesWithIds = React.useCallback((policyIds: Uuid[]) => {
        return mutate(policyIds).then((response) => {
            let errorCount = policyIds.length;

            if (response.payload?.status === 200) {
                const success = response.payload.value;
                errorCount = policyIds.filter(id => !success.includes(id)).length;
                response.payload.value.forEach(uuid => onDeleted && onDeleted(uuid));
            }

            if (errorCount > 0) {
                if (errorCount === 1) {
                    addDangerNotification('Error removing policy', `There was an error when trying to remove a policy.`);
                } else {
                    addDangerNotification('Error removing policies', `There was an error when trying to remove ${errorCount} policies.`);
                }
            }

            return errorCount !== policyIds.length;
        });
    }, [ mutate, onDeleted ]);

    return (
        <PolicyDeleteModal
            policy={ props.policy }
            count={ props.count }
            getPolicies={ props.getPolicies }
            isDeleting={ isLoading }
            onClose={ props.onClose }
            onDelete={ deletePoliciesWithIds }
        />
    );
};
