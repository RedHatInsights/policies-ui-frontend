import { ActionEmail } from '../ActionEmail';
import { ActionType } from '../ActionType';
import { isAction, isActionEmail, isActionWebhook } from '../Action';
import { ActionWebhook } from '../ActionWebhook';

describe('src/types/Policy/Actions', () => {

    it('isAction returns true for ActionEmail', () => {
        const action: ActionEmail = {
            type: ActionType.EMAIL
        };
        expect(isAction(action)).toBe(true);
    });

    it('isAction returns true for ActionWebhook', () => {
        const action: ActionWebhook = {
            type: ActionType.WEBHOOK
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

    it('isActionWebhook returns false for ActionEmail', () => {
        const action: ActionEmail = {
            type: ActionType.EMAIL
        };
        expect(isActionWebhook(action)).toBe(false);
    });

    it('isActionWebhook returns true for ActionWebhook', () => {
        const action: ActionWebhook = {
            type: ActionType.WEBHOOK
        };
        expect(isActionWebhook(action)).toBe(true);
    });

    it('isActionEmail returns false for ActionWebhook', () => {
        const action: ActionWebhook = {
            type: ActionType.WEBHOOK
        };
        expect(isActionEmail(action)).toBe(false);
    });
});
