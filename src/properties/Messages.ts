import { DeepReadonly } from 'ts-essentials';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    tables: {
        policy: {
            title: 'Custom Policies',
            emptyState: {
                neverRun: 'Never',
                noActions: 'No actions configured.',
                noConditions: 'No conditions configured.',
                noDescription: '--'
            }
        }
    },
    wizards: {
        policy: {
            actions: {
                title: 'Actions'
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
