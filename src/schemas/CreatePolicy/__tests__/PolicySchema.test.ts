import { PolicyFormActions, PolicyFormConditions, PolicyFormDetails } from '../PolicySchema';
import { ActionType } from '../../../types/Policy/Actions';

describe('src/schemas/CreatePolicy/PolicySchema', () => {
    describe('PolicyFormDetails', () => {
        it('Fails on empty', () => {
            expect(PolicyFormDetails.isValidSync({})).toBeFalsy();
        });

        it('Only name is required', () => {
            expect(PolicyFormDetails.isValidSync({
                name: 'hello world'
            })).toBeTruthy();
        });

        it('Name only allows 150 characters', () => {
            expect(PolicyFormDetails.isValidSync({
                name: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget' +
                    ' dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis p more than 150'
            })).toBeFalsy();
        });

        it('Allows isEnabled as boolean', () => {
            expect(PolicyFormDetails.isValidSync({
                name: 'hello world',
                isEnabled: true
            })).toBeTruthy();
        });

        it('Fails if isEnabled is not a boolean', () => {
            expect(PolicyFormDetails.isValidSync({
                name: 'hello world',
                isEnabled: 'foo bar'
            })).toBeFalsy();
        });

        it('Description is a string', () => {
            expect(PolicyFormDetails.isValidSync({
                name: 'hello world',
                description: 'hey'
            })).toBeTruthy();
        });

        it('Allows all the params', () => {
            expect(PolicyFormDetails.isValidSync({
                name: 'hello world',
                description: 'hey',
                isEnabled: false
            })).toBeTruthy();
        });

        it('Trims name and description', () => {
            const result = PolicyFormDetails.cast({
                name: '        hello   ',
                description: '  foo      ',
                isEnabled: false
            });
            expect(result.name).toBe('hello');
            expect(result.description).toBe('foo');
        });
    });

    describe('PolicyFormActions', () => {
        it('Allows empty object', () => {
            expect(PolicyFormActions.isValidSync({})).toBeTruthy();
        });

        it('Allows actions with empty array', () => {
            expect(PolicyFormActions.isValidSync({
                actions: []
            })).toBeTruthy();
        });

        it('Allows actions', () => {
            expect(PolicyFormActions.isValidSync({
                actions: [
                    {
                        type: ActionType.EMAIL
                    },
                    {
                        type: ActionType.NOTIFICATION
                    }
                ]
            })).toBeTruthy();
        });

        it('Only allows one email', () => {
            expect(PolicyFormActions.isValidSync({
                actions: [
                    {
                        type: ActionType.EMAIL
                    },
                    {
                        type: ActionType.NOTIFICATION
                    },
                    {
                        type: ActionType.EMAIL
                    }
                ]
            })).toBeFalsy();
        });

        it('Only allows one notification', () => {
            expect(PolicyFormActions.isValidSync({
                actions: [
                    {
                        type: ActionType.EMAIL
                    },
                    {
                        type: ActionType.NOTIFICATION
                    },
                    {
                        type: ActionType.NOTIFICATION
                    }
                ]
            })).toBeFalsy();
        });
    });

    describe('PolicyFormConditions', () => {
        it('Fails on empty object', () => {
            expect(PolicyFormConditions.isValidSync({})).toBeFalsy();
        });

        it('Accepts conditions field', () => {
            expect(PolicyFormConditions.isValidSync({
                conditions: 'arch = "x86_64"'
            })).toBeTruthy();
        });

        it('Trims conditions when casting', () => {
            expect(PolicyFormConditions.cast({
                conditions: '  arch = "x86_64"    '
            }).conditions).toBe('arch = "x86_64"');
        });
    });
});
