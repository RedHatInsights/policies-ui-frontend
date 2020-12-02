import { UseSortReturn } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import {
    UsePolicyFilterReturn,
    UsePolicyPageReturn,
    UsePolicyRowsReturn
} from '../../../../hooks';
import { useGetPoliciesQuery } from '../../../../services/useGetPolicies';
import { NewPolicy } from '../../../../types/Policy/Policy';

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
