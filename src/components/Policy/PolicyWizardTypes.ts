import * as React from 'react';
import * as Yup from 'yup';

import { WizardStep } from '@patternfly/react-core';
import { DeepPartial, DeepReadonly } from 'ts-essentials';
import { Policy } from '../../types/Policy';

export type PartialPolicy = DeepPartial<Policy>;

export type WizardStepExtended = WizardStep & {
  validationSchema: Yup.Schema<unknown>;
  isValid?: (context: WizardContext, values: DeepReadonly<PartialPolicy>) => boolean;
};

export const AlwaysValid = Yup.object();

export enum WizardActionType {
  SAVE = 'CREATE',
  VALIDATE_CONDITION = 'VALIDATE_CONDITION',
  NONE = 'NONE'
}

export interface VerifyPolicyResponse {
    isValid: boolean;
    error?: string;
    policy?: PartialPolicy;
}

export interface CreatePolicyResponse {
    created: boolean;
    error?: string;
}

export interface WizardContext {
  isLoading: boolean;
  isFormValid: boolean;
  isValid?: boolean;
  triggerAction: (action: WizardActionType) => void;
  verifyResponse: VerifyPolicyResponse;
  createResponse: CreatePolicyResponse;
}

export const WizardContext = React.createContext<WizardContext>({
    isLoading: false,
    isFormValid: false,
    triggerAction: () => {
        throw Error('Action executed without WizardContext');
    },
    verifyResponse: {
        isValid: false
    },
    createResponse: {
        created: false
    }
});
