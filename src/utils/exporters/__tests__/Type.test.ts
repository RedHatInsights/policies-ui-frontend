import { ExporterType, exporterTypeFromString } from '../Type';

describe('src/utils/exporters/PolicyExporter/Type', () => {
    it('fromString lower case csv', () => {
        const type = exporterTypeFromString('csv');
        expect(type).toEqual(ExporterType.CSV);
    });

    it('fromString lower case json', () => {
        const type = exporterTypeFromString('json');
        expect(type).toEqual(ExporterType.JSON);
    });

    it('fromString upper case CSV', () => {
        const type = exporterTypeFromString('CSV');
        expect(type).toEqual(ExporterType.CSV);
    });

    it('fromString upper case JSON', () => {
        const type = exporterTypeFromString('JSON');
        expect(type).toEqual(ExporterType.JSON);
    });

    it('fromString weird case cSv', () => {
        const type = exporterTypeFromString('CSV');
        expect(type).toEqual(ExporterType.CSV);
    });

    it('fromString weird case JsOn', () => {
        const type = exporterTypeFromString('JSON');
        expect(type).toEqual(ExporterType.JSON);
    });

    it('throws error on anything else', () => {
        const test = () => {
            exporterTypeFromString('xml');
        };

        expect(test).toThrowError(Error);
    });

});
