import * as React from 'react';
import { Button, ButtonVariant, Modal } from '@patternfly/react-core';
import { Policy } from '../../types/Policy';
import { useDeletePolicyMutation } from '../../services/Api';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';

export interface DeletePolicyProps {
    policy?: Policy;
    onClose: (deleted: boolean) => void;
}

export const DeletePolicy: React.FunctionComponent<DeletePolicyProps> = (props) => {

    const { policy, onClose } = props;

    const { mutate, loading } = useDeletePolicyMutation();

    const onCancel = React.useCallback(() => {
        onClose(false);
    }, [ onClose ]);

    const deletePolicy = React.useCallback(() => {
        if (policy) {
            mutate(policy).then(() => {
                onClose(true);
            });
        }

        throw Error('Policy has not been set');
    }, [ mutate, policy, onClose ]);

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

    if (!props.policy) {
        return null;
    }

    return (
        <Modal
            title="Delete policy"
            isOpen={ true }
            onClose={ onCancel }
            actions={ actions }
            isFooterLeftAligned
            isSmall
        >
            Do you want to delete the policy: { props.policy.name } ?
        </Modal>
    );
};
