import * as React from 'react';
import { NewPolicy, Policy } from '../../../../types/Policy/Policy';
import {
    UsePaginatedQueryResponse,
    UsePolicyFilterReturn,
    UsePolicyPageReturn,
    UsePolicyRowsReturn
} from '../../../../hooks';
import { UsePolicySortReturn } from '../../../../hooks/useSort';

export interface CreatePolicyStepContextType {
    copyPolicy: boolean;
    setCopyPolicy: (param: boolean) => void;
    copiedPolicy: NewPolicy | undefined;
    setCopiedPolicy: (param: NewPolicy | undefined) => void;
    policyFilter: UsePolicyFilterReturn;
    policyPage: UsePolicyPageReturn;
    policySort: UsePolicySortReturn;
    policyQuery: UsePaginatedQueryResponse<Policy[]>;
    policyRows: UsePolicyRowsReturn;
}

export const CreatePolicyStepContext = React.createContext<CreatePolicyStepContextType | undefined>(undefined);
