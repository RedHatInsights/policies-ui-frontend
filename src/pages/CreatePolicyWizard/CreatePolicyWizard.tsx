import { addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import * as HttpStatus from 'http-status-codes';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { CreatePolicyResponse, VerifyPolicyResponse } from '../../components/Policy/PolicyWizardTypes';
import { useFacts } from '../../hooks/useFacts';
import { linkTo } from '../../InsightsRoutes';
import { useSavePolicyMutation } from '../../services/useSavePolicy';
import { useValidatePolicyNameParametrizedQuery } from '../../services/useValidatePolicyName';
import { useVerifyPolicyMutation } from '../../services/useVerifyPolicy';
import { NewPolicy, Policy } from '../../types/Policy/Policy';

type CreatePolicyWizardBase = {
    close: (policy: Policy | undefined) => void;
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
            if (res.payload?.type === 'Policy') {
                if (policy.id === undefined) {
                    addSuccessNotification(`Created policy "${policy.name}"`, <span> From the Policies list, open
                        <Link to={ linkTo.policyDetail(res.payload.value.id as string) }>{ policy.name }</Link>.</span>);
                } else {
                    addSuccessNotification('Saved', `Updated policy "${policy.name}"`);
                }

                props.close && props.close(res.payload.value);
                return {
                    created: true
                };
            } else if (res.status === HttpStatus.NOT_FOUND) {
                if (policy.id !== undefined) {
                    return {
                        created: false,
                        error: 'This policy cannot be found. It may have been deleted by another user. Your changes cannot be saved.'
                    };
                }
            }

            let msg = `Unknown Error when trying to ${
                policy.id === undefined ? 'create' : 'update'
            } the policy: (Code ${res.status})`;

            if (res.payload?.type === 'Msg') {
                msg = res.payload.value.msg ?? msg;
            }

            return {
                created: false,
                error: msg
            };
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

            if (res.payload?.type === 'Msg' && res.payload.value.msg) {
                return {
                    isValid: false,
                    error: res.payload.value.msg,
                    policy
                };
            }

            return {
                isValid: false,
                error: `Unknown Error when trying to validate: (Code ${res.status})`,
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

            if (res.status === HttpStatus.CONFLICT) {
                return {
                    created: false,
                    error: 'This policy name already exists. Please input a unique policy name.'
                };
            }

            const message = (res.payload?.value as any).msg;

            if (message) {
                return {
                    created: false,
                    error: message
                };
            }

            return {
                created: false,
                error: `Invalid name found (Code: ${res.status})`
            };
        });
    }, [ validateNameParamQuery.query ]);

    const isLoading = saveMutation.loading || verifyMutation.loading || validateNameParamQuery.loading;

    return (
        <>
            { props.isOpen &&
            <PolicyWizard
                initialValue={ props.initialValue || { } }
                onClose={ () => { props.close(undefined); } }
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
