import * as React from 'react';
import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { useVerifyPolicyMutation } from '../../services/Api';
import { useSavePolicyMutation } from '../../services/useSavePolicy';
import * as HttpStatus from 'http-status-codes';
import { addSuccessNotification } from '../../utils/AlertUtils';
import { CreatePolicyResponse, VerifyPolicyResponse } from '../../components/Policy/PolicyWizardTypes';
import { Policy, NewPolicy } from '../../types/Policy/Policy';

type CreatePolicyWizardBase = {
    close: (policyCreated: boolean) => void;
    initialValue?: NewPolicy;
    showCreateStep: boolean;
    policiesExist?: boolean;
};

type CreatePolicyWizardIsOpen = {
    isOpen: true;
} & CreatePolicyWizardBase;

type CreatePolicyWizardIsClose = {
    isOpen: false;
} & Partial<CreatePolicyWizardBase>;

type CreatePolicyWizardProps = CreatePolicyWizardIsClose | CreatePolicyWizardIsOpen;

export const CreatePolicyWizard: React.FunctionComponent<CreatePolicyWizardProps> = (props) => {
    const saveMutation = useSavePolicyMutation();
    const verifyMutation = useVerifyPolicyMutation();

    const onSave = (policy: NewPolicy): Promise<CreatePolicyResponse> => {
        return saveMutation.mutate(policy).then((res) => {
            switch (res.status) {
                case HttpStatus.CREATED:
                case HttpStatus.OK:
                    if (policy.id === undefined) {
                        addSuccessNotification('Created', `Policy "${policy.name}" created`);
                    } else {
                        addSuccessNotification('Saved', `Policy "${policy.name}" has been updated`);
                    }

                    props.close && props.close(true);
                    return {
                        created: true
                    };
                default:
                    return {
                        created: false,
                        error: res.payload?.msg || `Unknown Error when trying to ${
                            policy.id === undefined ? 'create' : 'update'
                        } the policy: (Code ${res.status})`
                    };
            }
        });
    };

    const onVerify = (policy: Partial<Policy>): Promise<VerifyPolicyResponse> => {
        return verifyMutation.mutate(policy).then((res) => {
            if (res.status === HttpStatus.OK) {
                return {
                    isValid: true,
                    policy
                };
            }

            return {
                isValid: false,
                error: res.payload?.msg || `Unknown Error when trying to validate: (Code ${res.status})`,
                policy
            };
        });
    };

    const isLoading = saveMutation.loading || verifyMutation.loading;

    return (
        <>
            { props.isOpen &&
            <PolicyWizard
                initialValue={ props.initialValue || { } }
                onClose={ () => { props.close(false); } }
                onSave={ onSave }
                onVerify={ onVerify }
                showCreateStep={ props.policiesExist ? props.showCreateStep : false }
                isLoading={ isLoading }
                policiesExist={ props.policiesExist }
            />} 
        </>
    );
};
