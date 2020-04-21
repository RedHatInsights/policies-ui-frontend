import { PolicyExporterType } from './Type';
import { PolicyExporter } from './Base';
import { Policy } from '../../../types/Policy';
import { toServerAction } from '../../PolicyAdapter';

const headers: [keyof Policy, string][] = [
    [ 'id', 'id' ],
    [ 'name', 'name' ],
    [ 'description', 'description' ],
    [ 'isEnabled', 'isEnabled' ],
    [ 'conditions', 'conditions' ],
    [ 'actions', 'actions' ],
    [ 'lastEvaluation', 'lastEvaluation' ],
    [ 'mtime', 'mtime' ],
    [ 'ctime', 'ctime' ]
];

export const PolicyExporterCsv: PolicyExporter = {
    type: PolicyExporterType.CSV,
    export: (policies) => {
        const headerString = headers.map(h => h[1]).join(',') + '\r';
        const policiesArray = policies.map(p => ({ ...p, actions: toServerAction(p.actions) })).map(p => {
            return Object.values(headers).map(k => {
                const value = (p[k[0]] || '').toString().replace(/"/g, '""');
                return '"' + value + '"';
            }).join(',')  + '\r';
        });

        return new Blob([ headerString ].concat(policiesArray), {
            type: 'text/csv'
        });
    }
};
