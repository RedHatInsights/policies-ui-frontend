import * as React from 'react';
import {
    Button,
    WizardFooter,
    WizardContextConsumer,
    WizardStep,
    ButtonVariant, Bullseye
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';

// Copied from: https://github.com/patternfly/patternfly-react/blob/master/packages/patternfly-4/react-core/src/components/Wizard/Wizard.tsx#L451-L457
// Todo: https://github.com/patternfly/patternfly-react/issues/3545
interface WizardContextProps {
    goToStepById: (stepId: number | string) => void;
    goToStepByName: (stepName: string) => void;
    onNext: () => void;
    onBack: () => void;
    onClose: () => void;
    activeStep: WizardStep;
}

interface PolicyWizardFooterProps {
    isLoading: boolean;
    loadingText: string;
}

export const PolicyWizardFooter: React.FunctionComponent<PolicyWizardFooterProps> = (props) => {

    return (
        <WizardFooter>
            <WizardContextConsumer>
                { (_wizardContextProps) => {
                    const wcProps = _wizardContextProps as WizardContextProps;
                    return (
                        <>
                            <Button
                                variant={ ButtonVariant.primary }
                                type="submit"
                                onClick={ wcProps.onNext }
                                isDisabled={ props.isLoading || !wcProps.activeStep.enableNext }
                            >
                                { wcProps.activeStep.nextButtonText || 'Next' }
                            </Button>
                            { !wcProps.activeStep.hideBackButton && (
                                <Button
                                    variant={ ButtonVariant.secondary }
                                    onClick={ wcProps.onBack }
                                    isDisabled={ wcProps.activeStep.id === 0 || props.isLoading }
                                >
                                    Back
                                </Button>
                            )}
                            { !wcProps.activeStep.hideCancelButton && (
                                <Button variant={ ButtonVariant.link } onClick={ wcProps.onClose } isDisabled={ props.isLoading }>
                                    Cancel
                                </Button>
                            )}
                            { props.isLoading && (
                                <Bullseye>
                                    { props.loadingText } &nbsp;
                                    <Spinner size="md" />
                                </Bullseye>
                            )}
                        </>
                    );
                }}
            </WizardContextConsumer>
        </WizardFooter>
    );
};
