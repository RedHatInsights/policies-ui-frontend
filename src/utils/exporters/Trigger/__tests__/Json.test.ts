import { TriggerExporterJson } from '../Json';
import { ExporterType } from 'common-code-ui';

describe('src/utils/exporters/Trigger/Json', () => {
    it('has json type', () => {
        const exporter = new TriggerExporterJson();
        expect(exporter.type).toEqual(ExporterType.JSON);
    });

    it('has application/json type', () => {
        const result = new TriggerExporterJson().export([]);
        expect(result.type).toEqual('application/json');
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export', () => {
        const result = new TriggerExporterJson().export([]);
        expect(result.size).toEqual('[]'.length);
    });
});
