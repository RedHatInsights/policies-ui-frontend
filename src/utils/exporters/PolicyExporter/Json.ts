import { PolicyExporterType } from './Type';
import { PolicyExporter } from './Base';

export const PolicyExporterJson: PolicyExporter = {
    type: PolicyExporterType.JSON,
    export: (policies) => {
        return new Blob([ JSON.stringify(policies) ], {
            type: 'application/json'
        });
    }
};
