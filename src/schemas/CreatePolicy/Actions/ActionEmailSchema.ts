import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';

export const ActionEmailSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.EMAIL>(),
    to: Yup.string().email('The email address is invalid').required('Specify what email address of the receiver').trim(),
    subject: Yup.string().required('Specify the subject of the email').trim(),
    message: Yup.string().required('Specify the contents of the message').trim()
});
