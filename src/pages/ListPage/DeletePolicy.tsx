import * as React from 'react';
import { Button, ButtonVariant, Modal } from '@patternfly/react-core';
import { Policy } from '../../types/Policy';
import { useBulkDeletePolicyMutation } from '../../services/Api';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import { addDangerNotification } from '../../utils/AlertUtils';
import { PolicyId } from '../../types/Policy/Policy';

export interface DeletePolicyProps {
    policies?: Policy[];
    onDeleted: (policyId: PolicyId) => void;
    onClose: (deleted: boolean) => void;
}

export const DeletePolicy: React.FunctionComponent<DeletePolicyProps> = (props) => {

    const { policies, onClose, onDeleted } = props;

    const { mutate, loading } = useBulkDeletePolicyMutation();

    const onCancel = React.useCallback(() => {
        onClose(false);
    }, [ onClose ]);

    const deletePolicy = React.useCallback(() => {
        if (policies) {
            mutate(policies).then((responses) => {
                responses.filter(r => r?.payload).forEach(r => onDeleted(r?.payload.id));
                const errors = responses.filter(response => response?.error).map(response => response?.errorObject);
                if (errors.length > 0) {
                    if (errors.length === 1) {
                        addDangerNotification('Error deleting policy', `There was an error when trying to delete a policy.`);
                    } else {
                        addDangerNotification('Error deleting policies', `There was an error when trying to delete ${errors.length} policy.`);
                    }
                }

                if (errors.length !== policies.length) {
                    onClose(true);
                }
            });
            return;
        }

        throw Error('Policy has not been set');
    }, [ mutate, policies, onClose, onDeleted ]);

    const actions = React.useMemo(() => [
        <Button key="confirm" variant={ ButtonVariant.danger } onClick={ deletePolicy } isDisabled={ loading }>
            { loading ? (
                <Spinner size="md"/>
            ) : 'Delete' }
        </Button>,
        <Button key="cancel" variant={ ButtonVariant.link } onClick={ onCancel } isDisabled={ loading }>
            Cancel
        </Button>
    ], [ loading, onCancel, deletePolicy ]);

    if (!props.policies || props.policies.length === 0) {
        return null;
    }

    return (
        <Modal
            title={ `Delete ${ props.policies.length === 1 ? 'policy' : 'policies' }` }
            isOpen={ true }
            onClose={ onCancel }
            actions={ actions }
            isFooterLeftAligned
            isSmall
        >
            {props.policies.length === 1 ?
                <>
                    Do you want to delete the policy <b>{props.policies[0].name}</b>?
                </>
                :
                <>
                    Do you want to delete the <b>{ props.policies.length }</b> selected policies?
                </>
            }
        </Modal>
    );
};
