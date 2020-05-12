import { computeOptions } from '../ComputeOptions';
import { Fact } from '../../../types/Fact';
import { FactType } from '../../../types/GeneratedOpenApi';

describe('src/components/Condition/ComputeOptions', () => {

    const testFacts: Fact[] = [
        {
            id: 1,
            name: 'foo.fact',
            type: FactType.STRING
        },
        {
            id: 2,
            name: 'bar.fact',
            type: FactType.STRING
        },
        {
            id: 3,
            name: 'baz',
            type: FactType.STRING
        }
    ];

    it('Should ignore partial logic operators', () => {
        const options = computeOptions('facts.arch = 5 an', testFacts);
        expect(options).toEqual({
            prefix: 'facts.arch = 5',
            options: [],
            postfix: 'AND'
        });
    });

    it('Should autocomplete facts', () => {
        const options = computeOptions('f', testFacts);
        expect(options).toEqual({
            prefix: '',
            options: [
                'foo.fact',
                'bar.fact'
            ],
            postfix: ''
        });
    });

    it('Should autocomplete facts on empty condition', () => {
        const options = computeOptions('', testFacts);
        expect(options).toEqual({
            prefix: '',
            options: [
                'foo.fact',
                'bar.fact',
                'baz'
            ],
            postfix: ''
        });
    });

    it('Should autocomplete facts even if we have round brackets', () => {
        const options = computeOptions('( f )', testFacts);
        expect(options).toEqual({
            prefix: '(',
            options: [
                'foo.fact',
                'bar.fact'
            ],
            postfix: ')'
        });
    });

    it('Should autocomplete facts even if we have a missing end round brackets', () => {
        const options = computeOptions('( f', testFacts);
        expect(options).toEqual({
            prefix: '(',
            options: [
                'foo.fact',
                'bar.fact'
            ],
            postfix: ')'
        });
    });

    it('Should autocomplete logic operators (and)', () => {
        const options = computeOptions('( facts = 1 an', testFacts);
        expect(options).toEqual({
            prefix: '( facts = 1',
            options: [
            ],
            postfix: 'AND )'
        });
    });

    it('Should autocomplete logic operators (or)', () => {
        const options = computeOptions('( facts = 1 o', testFacts);
        expect(options).toEqual({
            prefix: '( facts = 1',
            options: [
            ],
            postfix: 'OR )'
        });
    });

    it('Should autocomplete CONTAINS', () => {
        const options = computeOptions('fact con', testFacts);
        expect(options).toEqual({
            prefix: 'fact',
            options: [
            ],
            postfix: 'CONTAINS'
        });
    });

    it('Should autocomplete IN', () => {
        const options = computeOptions('fact i', testFacts);
        expect(options).toEqual({
            prefix: 'fact',
            options: [
            ],
            postfix: 'IN'
        });
    });

    it('should autocomplete with multiple conditions', () => {
        const options = computeOptions('facts.last_boot_time or facts.enabled_services CONTAINS', testFacts);
        expect(options).toEqual({
            prefix: 'facts.last_boot_time or facts.enabled_services',
            options: [
            ],
            postfix: 'CONTAINS'
        });
    });

    it.only('should preserve string_compare_operator if it ends in [', () => {
        const options = computeOptions('facts.last_boot_time and facts.number_of_sockets CONTAINS [', testFacts);
        expect(options).toEqual({
            prefix: 'facts.last_boot_time and facts.number_of_sockets CONTAINS',
            options: [
            ],
            postfix: '['
        });
    });

    it('Multiple logical operators are joined into the first', () => {
        const options = computeOptions('facts = 1 and or and or or fact = 2', testFacts);
        expect(options).toEqual({
            prefix: 'facts = 1 and fact =',
            options: [
            ],
            postfix: '2'
        });
    });
});
