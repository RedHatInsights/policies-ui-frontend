import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';

export const ActionWebhookSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.WEBHOOK>().oneOf([ ActionType.WEBHOOK ]).required()
});
