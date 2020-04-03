import { PolicyExporterType } from '../Type';
import { PolicyExporterCsv } from '../Csv';

describe('src/utils/exporters/PolicyExporter/Csv', () => {
    it('has csv type', () => {
        const exporter = PolicyExporterCsv;
        expect(exporter.type).toEqual(PolicyExporterType.CSV);
    });

    it('has text/csv type', () => {
        const result = PolicyExporterCsv.export([]);
        expect(result.type).toEqual('text/csv');
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export has the headers', () => {
        const result = PolicyExporterCsv.export([]);
        expect(result.size).toBeGreaterThan(0);
    });
});
