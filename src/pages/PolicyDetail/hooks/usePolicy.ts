import * as React from 'react';
import { useEffect } from 'react';
// This seems to be stable enough:
// https://github.com/facebook/react/issues/14259#issuecomment-505918440
import { unstable_batchedUpdates } from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { usePrevious } from 'react-use';

import { linkTo } from '../../../Routes';
import { Policy } from '../../../types/Policy';
import { Uuid } from '../../../types/Policy/Policy';

type PolicyDetailUrlParams = {
    policyId: string;
};

export const usePolicy = () => {
    const { policyId: policyIdFromUrl } = useParams<keyof PolicyDetailUrlParams>() as PolicyDetailUrlParams;

    const prevPolicyIdFromUrl = usePrevious(policyIdFromUrl);
    const navigate = useNavigate();
    const location = useLocation();
    const [ policy, setPolicyInternal ] = React.useState<Policy>();
    const policyId = policy?.id ?? policyIdFromUrl;

    const batchPolicyUpdate = React.useCallback((newPolicyId: Uuid, newPolicy: Policy | undefined) => {
        unstable_batchedUpdates(() => {
            setPolicyInternal(newPolicy);
            navigate(linkTo.policyDetail(newPolicyId));
        });
    }, [ navigate, setPolicyInternal ]);

    const setPolicy = React.useCallback((policy: Policy) => {
        if (policyIdFromUrl !== policy.id) {
            batchPolicyUpdate(policy.id, policy);
        } else {
            setPolicyInternal(policy);
        }
    }, [ batchPolicyUpdate, policyIdFromUrl ]);

    useEffect(() => {
        if (prevPolicyIdFromUrl !== policyIdFromUrl) {
            if (!policy || policy.id !== policyIdFromUrl) {
                setPolicyInternal(undefined);
            }
        }
    }, [ policyIdFromUrl, prevPolicyIdFromUrl, batchPolicyUpdate, location, policy, policyId ]);

    return {
        policyId,
        policy,
        setPolicy
    };
};
