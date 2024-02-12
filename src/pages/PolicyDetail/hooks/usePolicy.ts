import * as React from 'react';
import { useEffect } from 'react';
// This seems to be stable enough:
// https://github.com/facebook/react/issues/14259#issuecomment-505918440
import { unstable_batchedUpdates } from 'react-dom';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom-v5-compat';
import { usePrevious } from 'react-use';

import { linkTo } from '../../../Routes';
import { Policy } from '../../../types/Policy';
import { Uuid } from '../../../types/Policy/Policy';

export const usePolicy = () => {

    const { policyId: policyIdFromUrl } = useParams<{
        policyId: string;
    }>();
    const prevPolicyIdFromUrl = usePrevious(policyIdFromUrl);
    const history = useHistory();
    const [ policy, setPolicyInternal ] = React.useState<Policy>();
    const policyId = policy?.id || policyIdFromUrl;

    const batchPolicyUpdate = React.useCallback((newPolicyId: Uuid, newPolicy: Policy | undefined) => {
        unstable_batchedUpdates(() => {
            setPolicyInternal(newPolicy);
            history.push(linkTo.policyDetail(newPolicyId));
        });
    }, [ history, setPolicyInternal ]);

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
    }, [ policyIdFromUrl, prevPolicyIdFromUrl, batchPolicyUpdate, history, policy, policyId ]);

    return {
        policyId,
        policy,
        setPolicy
    };
};
