import { formatConditionError } from '../CreatePolicyWizard';

describe('src/pages/ListPage/CreatePolicyWizard', () => {
    it('formatConditionError strips "lines 1" and adds 1 to positions', () => {
        expect(
            formatConditionError(
                'Validation failed: Invalid expression: mismatched input \'123\' expecting {\'(\', NOT, NEG, SIMPLETEXT} at line 1 position 0'
            )
        ).toBe('Validation failed: Invalid expression: mismatched input \'123\' expecting {\'(\', NOT, NEG, SIMPLETEXT} at position 1');
        expect(
            formatConditionError(
                'Validation failed: Invalid expression: token recognition error at: \'\\\' at line 1 position 0'
            )
        ).toBe('Validation failed: Invalid expression: token recognition error at: \'\\\' at position 1');

        expect(
            formatConditionError(
                'Validation failed: Invalid expression: token recognition error at: \'\\\' at line 1 position 5'
            )
        ).toBe('Validation failed: Invalid expression: token recognition error at: \'\\\' at position 6');
    });
});
