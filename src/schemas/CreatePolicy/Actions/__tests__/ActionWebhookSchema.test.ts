import { ActionWebhookSchema } from '../ActionWebhookSchema';
import { ActionType } from '../../../../types/Policy/Actions';

describe('src/schemas/CreatePolicy/Actions/ActionWebhookSchema', () => {
    it('should fail when type is undefined', () => {
        expect(ActionWebhookSchema.isValidSync({
            type: undefined
        })).toBeFalsy();
    });

    it('should fail when type is omitted', () => {
        expect(ActionWebhookSchema.isValidSync({})).toBeFalsy();
    });

    it('should fail if type is not an ActionType', () => {
        expect(ActionWebhookSchema.isValidSync({
            type: 'foo'
        })).toBeFalsy();
    });

    it('should fail if type is ActionType.EMAIL', () => {
        expect(ActionWebhookSchema.isValidSync({
            type: ActionType.EMAIL
        })).toBeFalsy();
    });

    it('should succeed if using ActionType.WEBHOOK', () => {
        expect(ActionWebhookSchema.isValidSync({
            type: ActionType.WEBHOOK
        })).toBeTruthy();
    });
});
