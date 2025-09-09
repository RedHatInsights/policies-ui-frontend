import { DeepReadonly } from 'ts-essentials';

import { ActionType } from '../types/Policy/Actions';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

// Re-export useFeatureFlag for convenience
export { useFeatureFlag };
import { em } from 'csx';

const actionTypeToText: Record<ActionType, string> = {
    [ActionType.NOTIFICATION]: 'Notification'
};

//Capture some strings we reuse. Possibly use in i18n later?
const MutableMessages = {
    pages: {
        noPermissions: {
            title: 'Policies',
            emptyState: {
                title: 'You do not have access to Policies',
                content: 'Contact your organization administrator(s) for more information.'
            }
        },
        error: {
            title: 'Policies',
            emptyState: {
                title: 'Unhandled error',
                content: 'There was a problem trying to process your request.'
            }
        },
        listPage: {
            title: 'Policies',
            emailOptIn: 'One or more of your policies has a notification which may send an email. You can configure these notifications in the ' +
                '{0} for your organization. In order to receive emails from Insights, opt in to email notifications in your ' +
                'user preferences.',
            emailOptInLightspeed: 'One or more of your policies has a notification which may send an email. You can configure these notifications in the ' +
                '{0} for your organization. In order to receive emails from Red Hat Lightspeed, opt in to email notifications in your ' +
                'user preferences.',
            emptyState: {
                title: 'No Policies',
                text: [
                    'No policies have been created.',
                    'Use self defined-policies to monitor your RHEL configurations with instant or daily alerts.'
                ]
            }
        },
        policyDetail: {
            errorChangingEnabledStatus: {
                notFound: {
                    title: 'Policy not found',
                    text: 'The policy does not exists on the server. It may have been removed by another user.'
                },
                else: {
                    title: 'Enabled status change failed for policy',
                    text: 'There was an error setting the enabled status for this policy. Please try again.'
                }
            },
            emptyState: {
                title: 'Policy not found',
                text: 'This policy with ID {0} cannot be found. It may have been removed by another user.',
                backText: 'Back to previous page'
            },
            triggerEmptyState: {
                title: 'No recent triggers',
                text: 'This policy has not been triggered in the last 14 days.',
                sub: 'Trigger history is held for 14 days. If this policy was triggered before this time, it cannot be shown.'
            },
            errorState: {
                title: 'Error when loading policy',
                text: 'Error loading this policy.\nError {0}',
                actionText: 'Try again'
            },
            triggerErrorState: {
                title: 'Error when loading trigger history for policy',
                text: 'Error loading trigger history for this policy.\nError {0}',
                actionText: 'Try again'
            }
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
        },
        actionNotificationForm: {
            text: 'This action sends a notification to process the message as configured in {0}.',
            link: 'notification settings'
        }
    },
    tables: {
        policy: {
            title: 'Policies',
            columns: {
                name: 'Name',
                triggerActions: 'Trigger actions',
                lastTriggered: 'Last triggered'
            },
            emptyState: {
                neverRun: 'Never',
                noConditions: 'No conditions configured.',
                noDescription: '--',
                notFound: {
                    title: 'No matching policies found',
                    content: 'To continue, edit your filter settings and search again.'
                }
            },
            actions: {
                notification: 'Send a notification'
            }
        },
        trigger: {
            title: 'Trigger',
            columns: {
                date: 'Date',
                system: 'System'
            },
            emptyState: {
                notFound: {
                    title: 'No matching triggers found',
                    content: 'No triggers match the selected search terms.'
                }
            }
        }
    },
    wizards: {
        policy: {
            titleNew: 'Create a policy',
            titleEdit: 'Edit a policy',
            description: 'Policies are processed on reception of system profile messages. ' +
                'If condition(s) are met, defined action(s) are triggered.',
            actions: {
                title: 'Trigger actions',
                emailOptIn: 'The notification for this policy sends an email from Red Hat Insights.' +
                    ' To receive emails from Insights, opt in to email notifications in your user preferences.',
                emailOptInLightspeed: 'The notification for this policy sends an email from Red Hat Lightspeed.' +
                    ' To receive emails from Red Hat Lightspeed, opt in to email notifications in your user preferences.'
            },
            conditions: {
                title: 'Conditions',
                valid: 'Valid condition',
                invalid: 'Invalid condition',
                validating: 'Validating…',
                hint: 'e.g. facts.arch = "x86_64"',
                summaryDesc: 'Define conditions for your policy using any system facts.'
            },
            hints: {
                hintTitle: 'What conditions can I define?',
                hintParagraph1: 'You can write a condition for any combination of system facts that apply to your Insights inventory systems.',
                hintParagraph1Lightspeed: 'You can write a condition for any combination of system facts that apply to your Red Hat Lightspeed inventory systems.',
                hintLinkTitle: 'Review available system facts',
                // hintLinkTitleValue: '', // set this later.
                hintSyntaxExamplesSection: 'Syntax examples',
                hintQuestion1: 'Is wireshark RPM installed?',
                hintQuestion1Ans: 'facts.installed_packages contains [\'wireshark\']',
                hintQuestion2: 'Is the release older than RHEL 8.1?',
                hintQuestion2Ans: 'facts.os_release < 8.1',
                hintQuestion3: 'Which of my public cloud instances are missing a tag Owner value set?',
                hintQuestion3Ans: 'facts.cloud_provider in [\'alibaba\',\'aws\',\'azure\',\'google\'] and not tags.Owner',
                hintQuestion4: 'Is time synchronization configured for RHEL7 and RHEL8?',
                hintQuestion4Ans: '(facts.os_release >=7 and facts.os_release <8 and not facts.enabled_services contains \'ntpd\') or ' +
                    '(facts.os_release >=8 and not facts.enabled_services contains \'chronyd\')'
            },
            createPolicy: {
                title: 'Create Policy'
            },
            details: {
                title: 'Policy Details'
            },
            review: {
                title: 'Review and enable',
                enableThisPolicy: 'Enable this policy?',
                policyIsEnabled: 'Policy is enabled',
                policyIsDisabled: 'Policy is disabled',
                policy: {
                    details: 'Policy details',
                    name: 'Policy name',
                    description: 'Description'
                }
            }
        }
    },
    labels: {
        description: 'Description'
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
