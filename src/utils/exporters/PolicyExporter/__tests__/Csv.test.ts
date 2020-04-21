import { PolicyExporterType } from '../Type';
import { PolicyExporterCsv } from '../Csv';
import { ActionType } from '../../../../types/Policy/Actions';

describe('src/utils/exporters/PolicyExporter/Csv', () => {
    it('has csv type', () => {
        const exporter = PolicyExporterCsv;
        expect(exporter.type).toEqual(PolicyExporterType.CSV);
    });

    it('has text/csv type', () => {
        const result = PolicyExporterCsv.export([]);
        expect(result.type).toEqual('text/csv');
    });

    it('has 9 columns', () => {
        const result = PolicyExporterCsv.export([
            {
                id: '12345',
                name: 'hello world',
                description: 'my description',
                conditions: 'arch = x86_64',
                isEnabled: false,
                lastEvaluation: new Date(2030, 5, 5),
                actions: [
                    {
                        type: ActionType.WEBHOOK
                    },
                    {
                        type: ActionType.EMAIL
                    }
                ],
                ctime: new Date(2030, 5, 4),
                mtime: new Date(2030, 5, 6)
            }
        ]);

        const reader = new FileReader();
        return new Promise((done) => {
            reader.addEventListener('loadend', () => {
                const text = (reader.result as string).split('\r');
                expect(text[0]).toEqual('id,name,description,isEnabled,conditions,actions,lastEvaluation,mtime,ctime');
                done();
            });
            reader.readAsText(result);
        });
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export has the headers', () => {
        const result = PolicyExporterCsv.export([]);
        expect(result.size).toBeGreaterThan(0);
    });
});
