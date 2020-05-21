import { computeOptions } from '../ComputeOptions';
import { Fact } from '../../../types/Fact';
import { FactType } from '../../../generated/Types';

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

    it('Should ignore (for now) partial logic operators', () => {
        const options = computeOptions('facts.arch = 5 an', testFacts);
        expect(options).toEqual({
            prefix: 'facts.arch =',
            options: [],
            postfix: '5'
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

    it('Should ignore logic operators', () => {
        const options = computeOptions('( facts = 1 an', testFacts);
        expect(options).toEqual({
            prefix: '( facts =',
            options: [
            ],
            postfix: '1'
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
