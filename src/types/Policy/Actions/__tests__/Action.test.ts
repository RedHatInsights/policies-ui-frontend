import { isAction, isActionEmail, isActionNotification } from '../Action';
import { ActionEmail } from '../ActionEmail';
import { ActionNotification } from '../ActionNotification';
import { ActionType } from '../ActionType';

describe('src/types/Policy/Actions', () => {

    it('isAction returns true for ActionEmail', () => {
        const action: ActionEmail = {
            type: ActionType.EMAIL
        };
        expect(isAction(action)).toBe(true);
    });

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

    it('isActionEmail returns true for ActionEmail', () => {
        const action: ActionEmail = {
            type: ActionType.EMAIL
        };
        expect(isActionEmail(action)).toBe(true);
    });

    it('isActionNotification returns false for ActionEmail', () => {
        const action: ActionEmail = {
            type: ActionType.EMAIL
        };
        expect(isActionNotification(action)).toBe(false);
    });

    it('isActionNotification returns true for ActionNotification', () => {
        const action: ActionNotification = {
            type: ActionType.NOTIFICATION
        };
        expect(isActionNotification(action)).toBe(true);
    });

    it('isActionEmail returns false for ActionNotification', () => {
        const action: ActionNotification = {
            type: ActionType.NOTIFICATION
        };
        expect(isActionEmail(action)).toBe(false);
    });
});
