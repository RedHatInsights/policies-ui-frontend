import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';

export const ActionEmailSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.EMAIL>()
});
