import * as Yup from 'yup';
import { ActionType } from '../../../types/Policy/Actions';

export const ActionSlackSchema = Yup.object().shape({
    type: Yup.mixed<ActionType.SLACK>(),
    account: Yup.string().required('Specify Slack\'s account').trim(),
    token: Yup.string().required('Specify Slack\'s token').trim(),
    room: Yup.string().matches(/^#[\\w\\-]+$/, 'The slack room is not correct, start with "#"') .required('Specify Slack\'s room').trim()
});
