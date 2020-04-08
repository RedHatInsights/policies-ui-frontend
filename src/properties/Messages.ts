import { DeepReadonly } from 'ts-essentials';
import { ActionType } from '../types/Policy/Actions';

const actionTypeToText: Record<ActionType, string> = {
    [ActionType.EMAIL]: 'Email',
    [ActionType.WEBHOOK]: 'Hook'
};

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    pages: {
        listPage: {
            emailOptIn: 'One or more of your policies have an email alert. To receive these emails, opt in to email alerts.'
        }
    },
    components: {
        actions: {
            title: 'Trigger actions',
            noActions: 'No actions configured.'
        },
        actionType: actionTypeToText,
        emailOptIn: {
            title: 'Enable email alerts',
            switch: 'Get emails when a policy runs',
            link: 'Open email preferences'
        },
        lastTriggeredCell: {
            never: 'Never',
            ago: 'ago'
        }
    },
    tables: {
        policy: {
            title: 'Policies',
            columns: {
                name: 'Name',
                triggerActions: 'Trigger actions',
                lastEvaluated: 'Last evaluated'
            },
            emptyState: {
                neverRun: 'Never',
                noConditions: 'No conditions configured.',
                noDescription: '--'
            }
        }
    },
    wizards: {
        policy: {
            actions: {
                title: 'Trigger actions',
                emailOptIn: 'To receive emails for custom policies, opt in to email alerts from your user preferences.'
            },
            conditions: {
                title: 'Conditions',
                valid: 'Valid condition',
                invalid: 'Invalid condition',
                validating: 'Validating…',
                hint: 'e.g. facts.arch = "x86_64"'
            },
            createPolicy: {
                title: 'Create Policy'
            },
            details: {
                title: 'Policy Details'
            },
            review: {
                title: 'Review and activate',
                activateThisPolicy: 'Activate this policy?',
                policyIsActive: 'Policy is active',
                policyIsNotActive: 'Policy is not active',
                policy: {
                    details: 'Policy details',
                    name: 'Policy name',
                    description: 'Description'
                }
            }
        }
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
