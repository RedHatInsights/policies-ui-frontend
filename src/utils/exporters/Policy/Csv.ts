import { Policy } from '../../../types/Policy';
import { toServerAction } from '../../../types/adapters/PolicyAdapter';
import { ExporterCsv, ExporterHeaders } from '../Csv';

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
