import { triggerExporterFactory } from '../Factory';
import { TriggerExporterCsv } from '../Csv';
import { TriggerExporterJson } from '../Json';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';

describe('src/utils/exporters/Trigger/Factory', () => {
    it('get CSV Exporter', () => {
        const exporter = triggerExporterFactory(ExporterType.CSV);
        expect(exporter).toEqual(new TriggerExporterCsv());
    });

    it('get JSON Exporter', () => {
        const exporter = triggerExporterFactory(ExporterType.JSON);
        expect(exporter).toEqual(new TriggerExporterJson());
    });
});
