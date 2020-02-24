import * as React from 'react';
import { PolicyWizard, SavingMode } from '../../components/Policy/PolicyWizard';
import { useSavePolicyMutation, useVerifyPolicyMutation } from '../../services/Api';
import * as HttpStatus from 'http-status-codes';
import { addSuccessNotification } from '../../utils/AlertUtils';
import { CreatePolicyResponse, VerifyPolicyResponse } from '../../components/Policy/PolicyWizardTypes';
import { Policy, PolicyWithOptionalId } from '../../types/Policy/Policy';

type CreatePolicyWizardBase = {
    close: (policyCreated: boolean) => void;
    initialValue?: PolicyWithOptionalId;
    savingMode: SavingMode;
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

    if (props.savingMode === SavingMode.UPDATE && props.initialValue?.id === undefined) {
        throw new Error('Invalid SavingMode UPDATE for initialValue. initialValue must provide a Policy with an id');
    }

    const onSave = (policy: PolicyWithOptionalId): Promise<CreatePolicyResponse> => {
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
                            props.savingMode === SavingMode.CREATE ? 'create' : 'update'
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
                savingMode={ props.savingMode }
                isLoading={ isLoading }
            /> }
        </>
    );
};
