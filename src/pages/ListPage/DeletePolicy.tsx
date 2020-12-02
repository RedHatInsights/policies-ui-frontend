import { Button, ButtonVariant, Modal } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core';
import { addDangerNotification } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

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

    const { getPolicies, onClose, onDeleted, policy } = props;

    const { mutate, loading } = useMassDeletePoliciesMutation();

    const isLoading = loading || props.loading;

    const onCancel = React.useCallback(() => {
        onClose(false);
    }, [ onClose ]);

    const deletePoliciesWithIds = React.useCallback((policyIds: Uuid[]) => {
        mutate(policyIds).then((response) => {
            let errorCount = policyIds.length;

            if (response.payload?.status === 200) {
                const success = response.payload.value;
                errorCount = policyIds.filter(id => !success.includes(id)).length;
                response.payload.value.forEach(uuid => onDeleted && onDeleted(uuid));
            }

            if (errorCount > 0) {
                if (errorCount === 1) {
                    addDangerNotification('Error deleting policy', `There was an error when trying to delete a policy.`);
                } else {
                    addDangerNotification('Error deleting policies', `There was an error when trying to delete ${errorCount} policies.`);
                }
            }

            if (errorCount !== policyIds.length) {
                onClose(true);
            }
        });
    }, [ mutate, onClose, onDeleted ]);

    const deletePolicy = React.useCallback(async () => {
        if (policy) {
            deletePoliciesWithIds([ policy.id ]);
        } else if (getPolicies) {
            try {
                const policyIds = await getPolicies();
                deletePoliciesWithIds(policyIds);
            } catch (error) {
                addDangerNotification(
                    'Error while deleting',
                    'An error occurred while trying to delete the selection, please try again.'
                );
                console.error('Error while fetching selection', error);
            }
        } else {
            throw new Error('Expected policy or getPolicies to bet set');
        }
    }, [ getPolicies, deletePoliciesWithIds, policy ]);

    const actions = React.useMemo(() => [
        <Button key="confirm" variant={ ButtonVariant.danger } onClick={ deletePolicy } isDisabled={ isLoading }>
            { isLoading ? (
                <Spinner size="md" />
            ) : 'Delete' }
        </Button>,
        <Button key="cancel" variant={ ButtonVariant.link } onClick={ onCancel } isDisabled={ isLoading }>
            Cancel
        </Button>
    ], [ isLoading, onCancel, deletePolicy ]);

    let content;

    if (props.policy) {
        content = <>Do you want to delete the policy <b>{ props.policy.name }</b>?</>;
    } else if (props.count === 1) {
        content = <>Do you want to delete the selected policy?</>;
    } else {
        content = <>Do you want to delete the <b>{ props.count }</b> selected policies?</>;
    }

    return (
        <Modal
            title={ `Delete ${ props.count === 1 ? 'policy' : 'policies' }` }
            isOpen={ true }
            onClose={ onCancel }
            actions={ actions }

            variant="small"
        >
            { content }
        </Modal>
    );
};
