import { ActionType } from '../../../../types/Policy/Actions';
import { ActionEmailSchema } from '../ActionEmailSchema';

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

    it('should fail if type is ActionType.Notification', () => {
        expect(ActionEmailSchema.isValidSync({
            type: ActionType.NOTIFICATION
        })).toBeFalsy();
    });

    it('should succeed if using ActionType.EMAIL', () => {
        expect(ActionEmailSchema.isValidSync({
            type: ActionType.EMAIL
        })).toBeTruthy();
    });
});
