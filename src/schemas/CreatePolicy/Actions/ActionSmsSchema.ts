import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';

export const ActionSmsSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.SLACK>(),
    number: Yup.string().required('Specify the phone number').trim(),
    message: Yup.string().required('Specify the contents of the message').trim()
});
