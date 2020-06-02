import { TriggerExporterCsv } from '../Csv';
import { ExporterType } from '../../Type';

describe('src/utils/exporters/Trigger/Csv', () => {
    it('has csv type', () => {
        const exporter = new TriggerExporterCsv();
        expect(exporter.type).toEqual(ExporterType.CSV);
    });

    it('has text/csv type', () => {
        const result = new TriggerExporterCsv().export([]);
        expect(result.type).toEqual('text/csv');
    });

    it('has 9 columns', () => {
        const result = new TriggerExporterCsv().export([
            {
                id: '12345',
                hostName: 'hello world',
                created: new Date(2030, 5, 5),
            }
        ]);

        const reader = new FileReader();
        return new Promise((done) => {
            reader.addEventListener('loadend', () => {
                const text = (reader.result as string).split('\r');
                expect(text[0]).toEqual('id,system,ctime');
                done();
            });
            reader.readAsText(result);
        });
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export has the headers', () => {
        const result = new TriggerExporterCsv().export([]);
        expect(result.size).toBeGreaterThan(0);
    });
});
