import { PolicyExporterJson } from '../Json';
import { ExporterType } from '../../Type';

describe('src/utils/exporters/Policy/Json', () => {
    it('has json type', () => {
        const exporter = new PolicyExporterJson();
        expect(exporter.type).toEqual(ExporterType.JSON);
    });

    it('has application/json type', () => {
        const result = new PolicyExporterJson().export([]);
        expect(result.type).toEqual('application/json');
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export', () => {
        const result = new PolicyExporterJson().export([]);
        expect(result.size).toEqual('[]'.length);
    });
});
