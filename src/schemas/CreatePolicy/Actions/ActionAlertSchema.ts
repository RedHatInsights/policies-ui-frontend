import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';
import { SeveritySchema } from '../SeveritySchema';

export const ActionAlertSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.ALERT>(),
    severity: SeveritySchema.required('Specify the severity of the alert'),
    message: Yup.string().required('Specify a message for the Alert').trim()
});
