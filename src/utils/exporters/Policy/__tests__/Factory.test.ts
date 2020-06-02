import { policyExporterFactory } from '../Factory';
import { PolicyExporterCsv } from '../Csv';
import { PolicyExporterJson } from '../Json';
import { ExporterType } from '../../Type';

describe('src/utils/exporters/PolicyExporter/Factory', () => {
    it('get CSV Exporter', () => {
        const exporter = policyExporterFactory(ExporterType.CSV);
        expect(exporter).toEqual(new PolicyExporterCsv());
    });

    it('get JSON Exporter', () => {
        const exporter = policyExporterFactory(ExporterType.JSON);
        expect(exporter).toEqual(new PolicyExporterJson());
    });
});
