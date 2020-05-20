import * as React from 'react';
import {
    Button,
    WizardFooter,
    WizardContextConsumer,
    ButtonVariant, SplitItem, Split
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import { style } from 'typestyle';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { GlobalDangerColor100 } from '../../utils/PFColors';
import { useContext } from 'react';
import { WizardContext } from './PolicyWizardTypes';

const loadingClassName = style({
    marginTop: 'auto',
    marginBottom: 14
});

const exclamationClassName = style({
    marginRight: 5
});

interface PolicyWizardFooterProps {
    isLoading: boolean;
    loadingText: string;
    error?: string;
    onNext?: (context: WizardContext, goNext: () => void) => void;
}

export const PolicyWizardFooter: React.FunctionComponent<PolicyWizardFooterProps> = (props) => {

    const wizardContext = useContext(WizardContext);

    return (
        <WizardFooter>
            <WizardContextConsumer>
                { wcProps => {

                    const onNext = props.onNext && (() => {
                        if (props.onNext) {
                            props.onNext(wizardContext, wcProps.onNext);
                        }
                    });

                    return (
                        <>
                            <Button
                                variant={ ButtonVariant.primary }
                                type="submit"
                                onClick={ onNext || wcProps.onNext }
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
                            { !props.isLoading && props.error && (
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
