import * as React from 'react';
import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { Policy } from '../../types/Policy';
import { useCreatePolicyMutation } from '../../services/Api';
import * as HttpStatus from 'http-status-codes';
import { addSuccessNotification, addDangerNotification } from '../../utils/AlertUtils';

interface CreatePolicyWizardProps {
    close: () => void;
    isOpen: boolean;
}

interface AlertProps {
    variant: 'success' | 'danger';
    title: string;
}

export const CreatePolicyWizard: React.FunctionComponent<CreatePolicyWizardProps> = (props) => {
    const query = useCreatePolicyMutation();

    const onCreate = (policy: Policy) => {
        query.mutate(policy).then((res) => {
            switch (res.status) {
                case HttpStatus.CREATED:
                    addSuccessNotification('Created', `Policy "${policy.name}" created`);
                    props.close();
                    break;
                case HttpStatus.OK:
                    addSuccessNotification('Validated', `Policy "${policy.name}" validated`);
                    break;
                case HttpStatus.BAD_REQUEST:
                    addDangerNotification('Failed validation', `Policy "${policy.name}" is invalid`);
                    break;
                case HttpStatus.CONFLICT:
                    addDangerNotification('Failed creation', `Failed to persist Policy "${policy.name}"`);
                    break;
                case HttpStatus.INTERNAL_SERVER_ERROR:
                default:
                    addDangerNotification('Error', `An internal server error ocurred when processing Policy "${policy.name}"`);
            }
        });
    };

    return (
        <>
            { props.isOpen &&
            <PolicyWizard
                initialValue={ { actions: [{}]} }
                onClose={ props.close }
                onCreate={ onCreate }
            /> }
        </>
    );
};
