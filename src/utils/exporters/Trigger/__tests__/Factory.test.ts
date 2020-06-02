import { policyExporterFactory } from '../Factory';
import { TriggerExporterCsv } from '../Csv';
import { TriggerExporterJson } from '../Json';
import { ExporterType } from '../../Type';

describe('src/utils/exporters/Trigger/Factory', () => {
    it('get CSV Exporter', () => {
        const exporter = policyExporterFactory(ExporterType.CSV);
        expect(exporter).toEqual(new TriggerExporterCsv());
    });

    it('get JSON Exporter', () => {
        const exporter = policyExporterFactory(ExporterType.JSON);
        expect(exporter).toEqual(new TriggerExporterJson());
    });
});
