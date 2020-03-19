import * as React from 'react';
import {
    Button,
    WizardFooter,
    WizardContextConsumer,
    WizardStep,
    ButtonVariant, SplitItem, Split
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import { style } from 'typestyle';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { GlobalDangerColor100 } from '../../utils/PFColors';

const loadingClassName = style({
    marginTop: 'auto',
    marginBottom: 14
});

const exclamationClassName = style({
    marginRight: 5
});

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
    error?: string;
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
                                <div className={ loadingClassName }>
                                    { props.loadingText } &nbsp;
                                    <Spinner size="md" />
                                </div>
                            )}
                            { !props.isLoading && props. error && (
                                <Split className={ loadingClassName }>
                                    <SplitItem>
                                        <ExclamationCircleIcon className={ exclamationClassName } color={ GlobalDangerColor100 }/>
                                    </SplitItem>
                                    <SplitItem>{ props.error }</SplitItem>
                                </Split>
                            )}
                        </>
                    );
                }}
            </WizardContextConsumer>
        </WizardFooter>
    );
};
