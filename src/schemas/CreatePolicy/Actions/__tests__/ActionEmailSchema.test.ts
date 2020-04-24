import { ActionEmailSchema } from '../ActionEmailSchema';
import { ActionType } from '../../../../types/Policy/Actions';

describe('src/schemas/CreatePolicy/Actions/ActionEmailSchema', () => {
    it('should fail when type is undefined', () => {
        expect(ActionEmailSchema.isValidSync({
            type: undefined
        })).toBeFalsy();
    });

    it('should fail when type is omitted', () => {
        expect(ActionEmailSchema.isValidSync({})).toBeFalsy();
    });

    it('should fail if type is not an ActionType', () => {
        expect(ActionEmailSchema.isValidSync({
            type: 'foo'
        })).toBeFalsy();
    });

    it('should fail if type is ActionType.Webhook', () => {
        expect(ActionEmailSchema.isValidSync({
            type: ActionType.WEBHOOK
        })).toBeFalsy();
    });

    it('should succeed if using ActionType.EMAIL', () => {
        expect(ActionEmailSchema.isValidSync({
            type: ActionType.EMAIL
        })).toBeTruthy();
    });
});
