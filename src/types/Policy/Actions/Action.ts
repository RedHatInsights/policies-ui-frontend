import { ActionAlert } from './ActionAlert';
import { ActionEmail } from './ActionEmail';
import { ActionSlack } from './ActionSlack';
import { ActionSms } from './ActionSms';
import { ActionWebhook } from './ActionWebhook';
import { ActionType } from './ActionType';

export type Action = ActionAlert | ActionEmail | ActionSlack | ActionSms | ActionWebhook;

export const isActionAlert = (action: Action): action is ActionAlert => {
    return action.type === ActionType.ALERT;
};

export const isActionEmail = (action: Action): action is ActionEmail => {
    return action.type === ActionType.EMAIL;
};

export const isActionSlack = (action: Action): action is ActionSlack => {
    return action.type === ActionType.SLACK;
};

export const isActionSms = (action: Action): action is ActionSms => {
    return action.type === ActionType.SMS;
};

export const isActionWebhook = (action: Action): action is ActionWebhook => {
    return action.type === ActionType.WEBHOOK;
};
