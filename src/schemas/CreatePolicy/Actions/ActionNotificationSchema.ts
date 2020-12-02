import * as Yup from 'yup';

import { ActionType } from '../../../types/Policy/Actions';

export const ActionNotificationSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.NOTIFICATION>().oneOf([ ActionType.NOTIFICATION ]).required()
});
