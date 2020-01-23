import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';

export const ActionWebhookSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.WEBHOOK>(),
    endpoint: Yup.string().url('The url for the endpoint is not valid').required('Specify the endpoint url').trim()
});
