import * as React from 'react';
import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { useVerifyPolicyMutation } from '../../services/useVerifyPolicy';
import { useSavePolicyMutation } from '../../services/useSavePolicy';
import * as HttpStatus from 'http-status-codes';
import { addSuccessNotification } from '../../utils/AlertUtils';
import { CreatePolicyResponse, VerifyPolicyResponse } from '../../components/Policy/PolicyWizardTypes';
import { Policy, NewPolicy } from '../../types/Policy/Policy';
import { useValidatePolicyNameParametrizedQuery } from '../../services/useValidatePolicyName';
import { useFacts } from '../../hooks/useFacts';

type CreatePolicyWizardBase = {
    close: (policyCreated: boolean) => void;
    initialValue?: NewPolicy;
    showCreateStep: boolean;
    policiesExist?: boolean;
    isEditing: boolean;
};

type CreatePolicyWizardIsOpen = {
    isOpen: true;
} & CreatePolicyWizardBase;

type CreatePolicyWizardIsClose = {
    isOpen: false;
} & Partial<CreatePolicyWizardBase>;

type CreatePolicyWizardProps = CreatePolicyWizardIsClose | CreatePolicyWizardIsOpen;

export const formatConditionError = (conditionError: string) => {
    conditionError = conditionError.replace('line 1 ', '');
    conditionError = conditionError.replace(/position (\d+)$/, (_substring: string, group1: string) => {
        return `position ${+group1 + 1}`;
    });
    return conditionError;
};

export const CreatePolicyWizard: React.FunctionComponent<CreatePolicyWizardProps> = (props) => {
    const saveMutation = useSavePolicyMutation();
    const verifyMutation = useVerifyPolicyMutation();
    const validateNameParamQuery = useValidatePolicyNameParametrizedQuery();
    const facts = useFacts();

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
                case HttpStatus.NOT_FOUND:
                    if (policy.id !== undefined) {
                        return {
                            created: false,
                            error: 'This policy cannot be found. It may have been deleted by another user. Your changes cannot be saved.'
                        };
                    }

                // On purpose falling to the default when previous condition did not match
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

            const error = res.payload?.msg ? formatConditionError(res.payload?.msg as string) : undefined;

            return {
                isValid: false,
                error: error || `Unknown Error when trying to validate: (Code ${res.status})`,
                policy
            };
        });
    };

    const onValidateName = React.useCallback((policy: Partial<Policy>): Promise<CreatePolicyResponse> => {
        const query = validateNameParamQuery.query;
        return query(policy).then(res => {
            if (res.status === HttpStatus.OK) {
                return {
                    created: false
                };
            }

            return {
                created: false,
                error: res.payload?.msg || `Invalid name (Code: ${res.status})`
            };
        });
    }, [ validateNameParamQuery.query ]);

    const isLoading = saveMutation.loading || verifyMutation.loading || validateNameParamQuery.loading;

    return (
        <>
            { props.isOpen &&
            <PolicyWizard
                initialValue={ props.initialValue || { } }
                onClose={ () => { props.close(false); } }
                onSave={ onSave }
                onVerify={ onVerify }
                onValidateName={ onValidateName }
                showCreateStep={ props.policiesExist ? props.showCreateStep : false }
                isLoading={ isLoading }
                facts={ facts }
                isEditing={ props.isEditing }
            />}
        </>
    );
};
