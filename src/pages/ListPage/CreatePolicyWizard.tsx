import * as React from 'react';
import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { Policy } from '../../types/Policy';
import { useCreatePolicyMutation, useVerifyPolicyMutation } from '../../services/Api';
import * as HttpStatus from 'http-status-codes';
import { addSuccessNotification, addDangerNotification } from '../../utils/AlertUtils';
import { VerifyPolicyResponse } from '../../components/Policy/PolicyWizardTypes';

interface CreatePolicyWizardProps {
    close: () => void;
    isOpen: boolean;
}

export const CreatePolicyWizard: React.FunctionComponent<CreatePolicyWizardProps> = (props) => {
    const saveMutation = useCreatePolicyMutation();
    const verifyMutation = useVerifyPolicyMutation();

    const onSave = (policy: Policy) => {
        saveMutation.mutate(policy).then((res) => {
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
                    addDangerNotification('Error', `An internal server error occurred when processing Policy "${policy.name}"`);
            }
        });
    };

    const onVerify = (policy: Policy): Promise<VerifyPolicyResponse> => {
        return verifyMutation.mutate(policy).then((res) => {
            switch (res.status) {
                case HttpStatus.OK:
                    return {
                        isValid: true,
                        conditions: policy.conditions
                    };
                case HttpStatus.BAD_REQUEST:
                    return {
                        isValid: false,
                        error: res.payload.msg,
                        conditions: policy.conditions
                    };
            }

            return {
                isValid: false,
                error: res.payload || `Unknown Error when trying to validate: (Code ${res.status})`,
                conditions: policy.conditions
            };
        });
    };

    const isLoading = saveMutation.loading || verifyMutation.loading;

    return (
        <>
            { props.isOpen &&
            <PolicyWizard
                initialValue={ { } }
                onClose={ props.close }
                onSave={ onSave }
                onVerify={ onVerify }
                isLoading={ isLoading }
            /> }
        </>
    );
};
