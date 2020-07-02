import { assertNever, Exporter, ExporterType } from 'common-code-ui';
import { PolicyExporterCsv } from './Csv';
import { PolicyExporterJson } from './Json';
import { Policy } from '../../../types/Policy';

export const policyExporterFactory = (type: ExporterType): Exporter<Policy> => {
    switch (type) {
        case ExporterType.CSV:
            return new PolicyExporterCsv();
        case ExporterType.JSON:
            return new PolicyExporterJson();
    }

    assertNever(type);
};
