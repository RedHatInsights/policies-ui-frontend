import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';

import { PolicyExporterCsv } from '../Csv';
import { policyExporterFactory } from '../Factory';
import { PolicyExporterJson } from '../Json';

describe('src/utils/exporters/Policy/Factory', () => {
    it('get CSV Exporter', () => {
        const exporter = policyExporterFactory(ExporterType.CSV);
        expect(exporter).toEqual(new PolicyExporterCsv());
    });

    it('get JSON Exporter', () => {
        const exporter = policyExporterFactory(ExporterType.JSON);
        expect(exporter).toEqual(new PolicyExporterJson());
    });

    it('Wrong type throws exception', () => {
        expect(() => policyExporterFactory('foo' as any)).toThrow();
    });
});
