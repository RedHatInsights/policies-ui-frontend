import { Exporter, ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { PolicyExporterCsv } from './Csv';
import { PolicyExporterJson } from './Json';
import { Policy } from '../../../types/Policy';
import { assertNever } from 'assert-never';

export const policyExporterFactory = (type: ExporterType): Exporter<Policy> => {
    switch (type) {
        case ExporterType.CSV:
            return new PolicyExporterCsv();
        case ExporterType.JSON:
            return new PolicyExporterJson();
    }

    assertNever(type);
};
