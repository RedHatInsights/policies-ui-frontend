import { DeepReadonly } from 'ts-essentials';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    components: {
        actions: {
            title: 'Trigger actions',
            noActions: 'No actions configured.'
        }
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
                title: 'Review'
            }
        }
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
