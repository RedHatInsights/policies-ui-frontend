import { assertNever } from '../../Assert';
import { PolicyExporterCsv } from './Csv';
import { PolicyExporterJson } from './Json';
import { Exporter } from '../Base';
import { Policy } from '../../../types/Policy';
import { ExporterType } from '../Type';

export const policyExporterFactory = (type: ExporterType): Exporter<Policy> => {
    switch (type) {
        case ExporterType.CSV:
            return new PolicyExporterCsv();
        case ExporterType.JSON:
            return new PolicyExporterJson();
    }

    assertNever(type);
};
