import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';

import { TriggerExporterCsv } from '../Csv';
import { triggerExporterFactory } from '../Factory';
import { TriggerExporterJson } from '../Json';

describe('src/utils/exporters/Trigger/Factory', () => {
    it('get CSV Exporter', () => {
        const exporter = triggerExporterFactory(ExporterType.CSV);
        expect(exporter).toEqual(new TriggerExporterCsv());
    });

    it('get JSON Exporter', () => {
        const exporter = triggerExporterFactory(ExporterType.JSON);
        expect(exporter).toEqual(new TriggerExporterJson());
    });

    it('Wrong type throws exception', () => {
        expect(() => triggerExporterFactory('foo' as any)).toThrow();
    });
});
