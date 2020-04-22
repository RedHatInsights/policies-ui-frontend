import { ActionEmail } from './ActionEmail';
import { ActionWebhook } from './ActionWebhook';
import { ActionType } from './ActionType';

export type Action = ActionEmail | ActionWebhook;

export const isActionEmail = (action: Action): action is ActionEmail => {
    return action.type === ActionType.EMAIL;
};

export const isActionWebhook = (action: Action): action is ActionWebhook => {
    return action.type === ActionType.WEBHOOK;
};

export const isAction = (maybeAction: any): maybeAction is Action => {
    return isActionEmail(maybeAction) || isActionWebhook(maybeAction);
};
