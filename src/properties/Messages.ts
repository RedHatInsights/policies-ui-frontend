import { DeepReadonly } from 'ts-essentials';

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    pages: {
        listPage: {
            emailOptIn: 'One or more of your policies have an email alert, but you have not opted into receiving alert emails from' +
                ' Custom Policies. You will not receive any emails from your policies.'
        }
    },
    components: {
        actions: {
            title: 'Trigger actions',
            noActions: 'No actions configured.'
        },
        emailOptIn: {
            title: 'Email alerts not opted in',
            switch: 'Get emails when a policy runs',
            link: 'Open email preferences'
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
                title: 'Trigger actions',
                emailOptIn: 'Your policy has an email alert, but you have not opted into receiving alerts emails from' +
                    ' Custom Policies. You will not receive any email from your policies.'
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
