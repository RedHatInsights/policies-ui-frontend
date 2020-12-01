import * as React from 'react';
import { NewPolicy } from '../../../../types/Policy/Policy';
import {
    UsePolicyFilterReturn,
    UsePolicyPageReturn,
    UsePolicyRowsReturn
} from '../../../../hooks';
import { UseSortReturn } from '@redhat-cloud-services/insights-common-typescript';
import { useGetPoliciesQuery } from '../../../../services/useGetPolicies';

export interface CreatePolicyStepContextType {
    copyPolicy: boolean;
    setCopyPolicy: (param: boolean) => void;
    copiedPolicy: NewPolicy | undefined;
    setCopiedPolicy: (param: NewPolicy | undefined) => void;
    policyFilter: UsePolicyFilterReturn;
    policyPage: UsePolicyPageReturn;
    policySort: UseSortReturn;
    policyQuery: ReturnType<typeof useGetPoliciesQuery>;
    policyRows: UsePolicyRowsReturn;
}

export const CreatePolicyStepContext = React.createContext<CreatePolicyStepContextType | undefined>(undefined);
