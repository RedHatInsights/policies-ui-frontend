import { ExporterCsv, ExporterHeaders } from '@redhat-cloud-services/insights-common-typescript';

import { toServerAction } from '../../../types/adapters/PolicyAdapter';
import { Policy } from '../../../types/Policy';

export class PolicyExporterCsv extends ExporterCsv<Policy> {

    public serialize(policy: Policy) {
        return {
            ...policy,
            actions: toServerAction(policy.actions)
        };
    }

    public headers(): ExporterHeaders<PolicyExporterCsv, Policy> {
        return [
            [ 'id', 'id' ],
            [ 'name', 'name' ],
            [ 'description', 'description' ],
            [ 'isEnabled', 'isEnabled' ],
            [ 'conditions', 'conditions' ],
            [ 'actions', 'actions' ],
            [ 'lastTriggered', 'lastTriggered' ],
            [ 'mtime', 'mtime' ],
            [ 'ctime', 'ctime' ]
        ];
    }
}
