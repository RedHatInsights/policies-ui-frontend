import * as React from 'react';
import { Button, ButtonVariant, Modal } from '@patternfly/react-core';
import { useBulkDeletePolicyMutation } from '../../services/useDeletePolicies';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import { addDangerNotification } from '../../utils/AlertUtils';
import { Policy, Uuid } from '../../types/Policy/Policy';

export interface DeletePolicyProps {
    getPolicies: () => Promise<Uuid[]>;
    onDeleted: (policyId: Uuid) => void;
    onClose: (deleted: boolean) => void;
    loading: boolean;
    count: number;
    policy?: Policy;
}

export const DeletePolicy: React.FunctionComponent<DeletePolicyProps> = (props) => {

    const { getPolicies, onClose, onDeleted, policy } = props;

    const { mutate, loading } = useBulkDeletePolicyMutation();

    const isLoading = loading || props.loading;

    const onCancel = React.useCallback(() => {
        onClose(false);
    }, [ onClose ]);

    const deletePoliciesWithIds = React.useCallback((policyIds: Uuid[]) => {
        mutate(policyIds).then((responses) => {
            responses.filter(r => r && !r.error).forEach(r => onDeleted(r?.payload.id));
            const errors = responses.filter(response => response?.error).map(response => response?.errorObject);
            if (errors.length > 0) {
                if (errors.length === 1) {
                    addDangerNotification('Error deleting policy', `There was an error when trying to delete a policy.`);
                } else {
                    addDangerNotification('Error deleting policies', `There was an error when trying to delete ${errors.length} policy.`);
                }
            }

            if (errors.length !== policyIds.length) {
                onClose(true);
            }
        });
    }, [ mutate, onClose, onDeleted ]);

    const deletePolicy = React.useCallback(async () => {
        if (policy) {
            deletePoliciesWithIds([ policy.id ]);
        } else {
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
        }
    }, [ getPolicies, deletePoliciesWithIds, policy ]);

    const actions = React.useMemo(() => [
        <Button key="confirm" variant={ ButtonVariant.danger } onClick={ deletePolicy } isDisabled={ isLoading }>
            { isLoading ? (
                <Spinner size="md"/>
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
            isFooterLeftAligned
            isSmall
        >
            { content }
        </Modal>
    );
};
