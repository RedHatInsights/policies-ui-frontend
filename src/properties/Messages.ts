import { DeepReadonly } from 'ts-essentials';
import { ActionType } from '../types/Policy/Actions';

const actionTypeToText: Record<ActionType, string> = {
    [ActionType.EMAIL]: 'Email',
    [ActionType.WEBHOOK]: 'Hook'
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
                content: 'There was a problem trying to process your request.',
                showDetails: 'Show details',
                actions: {
                    goToIndex: 'Go to Policy list'
                }
            }
        },
        listPage: {
            title: 'Policies',
            emailOptIn: 'One or more of your policies have an email alert. To receive these emails, opt in to email alerts.',
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
                    text: 'The policy does not exists on the server. It may have been deleted by another user.'
                },
                else: {
                    title: 'Enabled status change failed for policy',
                    text: 'There was an error setting the enabled status for this policy. Please try again.'
                }
            },
            emptyState: {
                title: 'Policy not found',
                text: 'This policy with ID {0} cannot be found. It may have been deleted by another user.',
                backText: 'Back to previous page'
            },
            triggerEmptyState: {
                title: 'No triggers found',
                text: 'This policy does not have any recent triggers'
            },
            errorState: {
                title: 'Error when loading policy',
                text: 'Error found when trying to load policy with ID {0}. (Error: {1})',
                actionText: 'Try again'
            },
            triggerErrorState: {
                title: 'Error when loading trigger history for policy',
                text: 'Error found when trying to load trigger history for policy with ID {0}. (Error: {1})',
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
        actionWebhookForm: {
            paragraph1: {
                head: 'This action sends a post to all hooks which have been activated for policies in the ',
                link: 'application settings.',
                tail: ''
            },
            paragraph2: {
                head: 'To activate a hook for policies, open the hook in the ',
                link: 'application settings',
                tail: ' and select your preference for sending a post under "Policies".'
            }
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
                    content: 'No policies matching the selected filter and search terms.'
                }
            },
            toolTips: {
                email: 'Send email',
                hook: 'Send to hook'
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
                    content: 'No triggers matching the search terms.'
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
                emailOptIn: 'To receive emails for custom policies, opt in to email alerts from your user preferences.'
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
                hintLinkTitle: 'Review available system facts',
                // hintLinkTitleValue: '', // set this later.
                hintSyntaxExamplesSection: 'Syntax examples',
                hintQuestion1: 'Is wireshark RPM installed?',
                hintQuestion1Ans: 'facts.installed_packages contains [\'wireshark\']',
                hintQuestion2: 'Is the release older than RHEL 8.1?',
                hintQuestion2Ans: 'facts.os_release < 8.1',
                hintQuestion3: 'Which of my public cloud instances are missing a tag Owner value set?',
                hintQuestion3Ans: 'facts.cloud_provider in [\'alibaba\',aws\',\'azure\',\'google\'] and not tags.Owner',
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
    }
};

export const Messages: DeepReadonly<typeof MutableMessages> = MutableMessages;
