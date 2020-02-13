import * as React from 'react';
import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { useCreatePolicyMutation, useVerifyPolicyMutation } from '../../services/Api';
import * as HttpStatus from 'http-status-codes';
import { addSuccessNotification } from '../../utils/AlertUtils';
import { CreatePolicyResponse, VerifyPolicyResponse } from '../../components/Policy/PolicyWizardTypes';
import { PolicyWithOptionalId } from '../../types/Policy/Policy';

interface CreatePolicyWizardProps {
    close: (policyCreated: boolean) => void;
    isOpen: boolean;
}

export const CreatePolicyWizard: React.FunctionComponent<CreatePolicyWizardProps> = (props) => {
    const saveMutation = useCreatePolicyMutation();
    const verifyMutation = useVerifyPolicyMutation();

    const onSave = (policy: PolicyWithOptionalId): Promise<CreatePolicyResponse> => {
        return saveMutation.mutate(policy).then((res) => {
            switch (res.status) {
                case HttpStatus.CREATED:
                    addSuccessNotification('Created', `Policy "${policy.name}" created`);
                    props.close(true);
                    return {
                        created: true
                    };
                case HttpStatus.BAD_REQUEST:
                case HttpStatus.CONFLICT:
                case HttpStatus.INTERNAL_SERVER_ERROR:
                default:
                    return {
                        created: false,
                        error: res.payload?.msg || `Unknown Error when trying to create the policy: (Code ${res.status})`
                    };
            }
        });
    };

    const onVerify = (policy: PolicyWithOptionalId): Promise<VerifyPolicyResponse> => {
        return verifyMutation.mutate(policy).then((res) => {
            switch (res.status) {
                case HttpStatus.OK:
                    return {
                        isValid: true,
                        conditions: policy.conditions
                    };
                case HttpStatus.BAD_REQUEST:
                default:
                    return {
                        isValid: false,
                        error: res.payload?.msg || `Unknown Error when trying to validate: (Code ${res.status})`,
                        conditions: policy.conditions
                    };
            }
        });
    };

    const isLoading = saveMutation.loading || verifyMutation.loading;

    return (
        <>
            { props.isOpen &&
            <PolicyWizard
                initialValue={ { } }
                onClose={ () => { props.close(false); } }
                onSave={ onSave }
                onVerify={ onVerify }
                isLoading={ isLoading }
            /> }
        </>
    );
};
