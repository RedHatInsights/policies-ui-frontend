import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';

export const ActionSchema = Yup.object().shape({
    type: Yup.mixed<ActionType>().required('Specify the action type')
});
