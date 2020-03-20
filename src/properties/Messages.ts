import { DeepReadonly } from 'ts-essentials';
import { ActionType } from '../types/Policy/Actions';

const actionTypeToText: Record<ActionType, string> = {
    [ActionType.EMAIL]: 'Email',
    [ActionType.WEBHOOK]: 'Hook'
};

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    components: {
        actions: {
            title: 'Trigger actions',
            noActions: 'No actions configured.'
        },
        actionType: actionTypeToText
    },
    tables: {
        policy: {
            title: 'Custom Policies',
            columns: {
                name: 'Name',
                triggerActions: 'Trigger actions',
                lastTriggered: 'Last triggered'
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
                title: 'Trigger actions'
            },
            conditions: {
                title: 'Conditions',
                valid: 'Valid condition',
                invalid: 'Invalid condition',
                validating: 'Validating…'
            },
            createPolicy: {
                title: 'Create Custom Policy'
            },
            details: {
                title: 'Details'
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
