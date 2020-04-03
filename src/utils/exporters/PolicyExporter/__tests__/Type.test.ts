import { PolicyExporterType, policyExporterTypeFromString } from '../Type';

describe('src/utils/exporters/PolicyExporter/Type', () => {
    it('fromString lower case csv', () => {
        const type = policyExporterTypeFromString('csv');
        expect(type).toEqual(PolicyExporterType.CSV);
    });

    it('fromString lower case json', () => {
        const type = policyExporterTypeFromString('json');
        expect(type).toEqual(PolicyExporterType.JSON);
    });

    it('fromString upper case CSV', () => {
        const type = policyExporterTypeFromString('CSV');
        expect(type).toEqual(PolicyExporterType.CSV);
    });

    it('fromString upper case JSON', () => {
        const type = policyExporterTypeFromString('JSON');
        expect(type).toEqual(PolicyExporterType.JSON);
    });

    it('fromString weird case cSv', () => {
        const type = policyExporterTypeFromString('CSV');
        expect(type).toEqual(PolicyExporterType.CSV);
    });

    it('fromString weird case JsOn', () => {
        const type = policyExporterTypeFromString('JSON');
        expect(type).toEqual(PolicyExporterType.JSON);
    });

    it('throws error on anything else', () => {
        const test = () => {
            policyExporterTypeFromString('xml');
        };

        expect(test).toThrowError(Error);
    });

});
