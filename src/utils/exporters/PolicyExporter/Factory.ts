import { assertNever } from '../../Assert';
import { PolicyExporterType } from './Type';
import { PolicyExporterCsv } from './Csv';
import { PolicyExporterJson } from './Json';
import { PolicyExporter } from './Base';

export const policyExporterFactory = (type: PolicyExporterType): PolicyExporter => {
    switch (type) {
        case PolicyExporterType.CSV:
            return PolicyExporterCsv;
        case PolicyExporterType.JSON:
            return PolicyExporterJson;
    }

    assertNever(type);
};
