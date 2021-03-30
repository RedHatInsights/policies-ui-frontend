import { isAction, isActionNotification } from '../Action';
import { ActionNotification } from '../ActionNotification';
import { ActionType } from '../ActionType';

describe('src/types/Policy/Actions', () => {

    it('isAction returns true for ActionNotification', () => {
        const action: ActionNotification = {
            type: ActionType.NOTIFICATION
        };
        expect(isAction(action)).toBe(true);
    });

    it('isAction returns false for string', () => {
        expect(isAction('stuff')).toBe(false);
    });

    it('isAction returns false for object', () => {
        expect(isAction({ foo: 'bar' })).toBe(false);
    });

    it('isAction returns false for object with type', () => {
        expect(isAction({ type: 'bar' })).toBe(false);
    });

    it('isAction returns false for object with type null', () => {
        expect(isAction({ type: null })).toBe(false);
    });

    it('isActionNotification returns true for ActionNotification', () => {
        const action: ActionNotification = {
            type: ActionType.NOTIFICATION
        };
        expect(isActionNotification(action)).toBe(true);
    });
});
