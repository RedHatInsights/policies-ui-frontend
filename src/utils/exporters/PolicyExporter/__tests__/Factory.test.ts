import { PolicyExporterType } from '../Type';
import { policyExporterFactory } from '../Factory';
import { PolicyExporterCsv } from '../Csv';
import { PolicyExporterJson } from '../Json';

describe('src/utils/exporters/PolicyExporter/Factory', () => {
    it('get CSV Exporter', () => {
        const exporter = policyExporterFactory(PolicyExporterType.CSV);
        expect(exporter).toEqual(PolicyExporterCsv);
    });

    it('get JSON Exporter', () => {
        const exporter = policyExporterFactory(PolicyExporterType.JSON);
        expect(exporter).toEqual(PolicyExporterJson);
    });

    it('Throws if something else specified', () => {
        expect(() => {
            policyExporterFactory('foo' as PolicyExporterType);
        }).toThrowError();
    });
});
