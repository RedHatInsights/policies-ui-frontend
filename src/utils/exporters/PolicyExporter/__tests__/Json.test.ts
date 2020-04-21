import { PolicyExporterType } from '../Type';
import { PolicyExporterJson } from '../Json';

describe('src/utils/exporters/PolicyExporter/Json', () => {
    it('has json type', () => {
        const exporter = PolicyExporterJson;
        expect(exporter.type).toEqual(PolicyExporterType.JSON);
    });

    it('has application/json type', () => {
        const result = PolicyExporterJson.export([]);
        expect(result.type).toEqual('application/json');
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export', () => {
        const result = PolicyExporterJson.export([]);
        expect(result.size).toEqual('[]'.length);
    });
});
