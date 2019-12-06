import { ActionAlert } from './ActionAlert';
import { ActionEmail } from './ActionEmail';
import { ActionSlack } from './ActionSlack';
import { ActionSms } from './ActionSms';
import { ActionWebhook } from './ActionWebhook';

export type Action = ActionAlert | ActionEmail | ActionSlack | ActionSms | ActionWebhook;
