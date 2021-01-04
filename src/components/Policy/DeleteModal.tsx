import {
    addDangerNotification,
    DeleteModal,
    DeleteModalProps
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { Policy } from '../../types/Policy';
import { Uuid } from '../../types/Policy/Policy';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface PolicyDeleteModalProps extends Omit<DeleteModalProps, UsedProps> {
    getPolicies?: () => Promise<Uuid[]>;
    policy?: Policy;
    count: number;
    onDelete: (policyIds: Uuid[]) => boolean | Promise<boolean>;
}

export const PolicyDeleteModal: React.FunctionComponent<PolicyDeleteModalProps> = (props) => {

    const onDeleteInternal = React.useCallback(async () => {
        const policy = props.policy;
        const onDelete = props.onDelete;
        const getPolicies = props.getPolicies;

        if (policy) {
            return onDelete([ policy.id ]);
        } else if (getPolicies) {
            try {
                const policyIds = await getPolicies();
                return onDelete(policyIds);
            } catch (error) {
                addDangerNotification(
                    'Error while removing',
                    'An error occurreds while trying to remove the selection, please try again.'
                );
                console.error('Error while fetching selection', error);
            }

        } else {
            throw new Error('Expected policy or getPolicies to bet set');
        }

        return false;
    }, [ props.onDelete, props.policy, props.getPolicies ]);

    const content = React.useMemo(() => {
        if (props.policy) {
            return <>Do you want to remove the policy <b>{ props.policy.name }</b>?</>;
        } else if (props.count === 1) {
            return <>Do you want to remove the selected policy?</>;
        } else {
            return <>Do you want to remove the <b>{ props.count }</b> selected policies?</>;
        }
    }, [ props.policy, props.count ]);

    if (!props.policy && !props.getPolicies) {
        return null;
    }

    return (
        <DeleteModal
            isOpen={ true }
            isDeleting={ props.isDeleting }
            title={ `Remove ${ props.count === 1 ? 'policy' : 'policies' }` }
            content={ content }
            onClose={ props.onClose }
            onDelete={ onDeleteInternal }
            error={ props.error }
        />
    );
};
