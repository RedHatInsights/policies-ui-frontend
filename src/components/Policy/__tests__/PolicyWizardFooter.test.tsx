import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { WizardContextProvider as PFWizardContextProvider, WizardContextType } from '@patternfly/react-core';
import { WizardContext } from '../PolicyWizardTypes';
import { PolicyWizardFooter } from '../PolicyWizardFooter';
import userEvent from '@testing-library/user-event';

describe('src/components/Policy/PolicyWizardFooter', () => {

    type Values = {
        onNext?: () => void;
        onBack?: () => void;
        onClose?: () => void;
        id?: number;
        enableNext?: boolean;
        nextButtonText?: string;
        hideBackButton?: boolean;
        hideCancelButton?: boolean;
    };

    const ifNotUndefined = <T extends any>(value: T | undefined,  whenUndefined: T) => value === undefined ? whenUndefined : value;

    const policyWizardContext: WizardContext = {
        triggerAction: jest.fn(),
        isLoading: false,
        facts: [],
        setVerifyResponse: jest.fn(),
        verifyResponse: {
            isValid: false,
            error: undefined,
            policy: undefined
        },
        createResponse: {
            error: undefined,
            created: false
        },
        isValid: true,
        isFormValid: true
    };

    const getWrapper = (values?: Values): React.ComponentType => {
        const pfContext: WizardContextType = {
            goToStepById: jest.fn(),
            goToStepByName: jest.fn(),
            onNext: values?.onNext || jest.fn(),
            onBack: values?.onBack || jest.fn(),
            onClose: values?.onClose || jest.fn(),
            activeStep: {
                id: ifNotUndefined(values?.id, 0),
                name: 'The foo',
                enableNext: ifNotUndefined(values?.enableNext, true),
                nextButtonText: values?.nextButtonText,
                hideBackButton: ifNotUndefined(values?.hideBackButton, false),
                hideCancelButton: ifNotUndefined(values?.hideCancelButton, false)
            }
        };

        const Wrapper: React.FunctionComponent = (props) => {
            return (
                <PFWizardContextProvider value={ pfContext }>
                    <WizardContext.Provider value={ policyWizardContext }>
                        { props.children }
                    </WizardContext.Provider>
                </PFWizardContextProvider>
            );
        };

        return Wrapper;
    };

    it('LoadingText is visible when loading', () => {
        const Wrapper = getWrapper();
        render(<PolicyWizardFooter isLoading={ true } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.getByText(/Loading 123/i)).toBeVisible();
    });

    it('LoadingText is hidden when not loading', () => {
        const Wrapper = getWrapper();
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Loading 123/i)).toBeFalsy();
    });

    it('Next is enabled when not loading', () => {
        const Wrapper = getWrapper();
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Next/i)).toBeEnabled();
    });

    it('Next is disabled when loading', () => {
        const Wrapper = getWrapper();
        render(<PolicyWizardFooter isLoading={ true } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Next/i)).toBeDisabled();
    });

    it('Error is show when set and not loading', () => {
        const Wrapper = getWrapper();
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' } error={ 'I am a bug' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/I am a bug/i)).toBeTruthy();
    });

    it('Error is hidden when set and loading', () => {
        const Wrapper = getWrapper();
        render(<PolicyWizardFooter isLoading={ true } loadingText={ 'Loading 123' } error={ 'I am a bug' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/I am a bug/i)).toBeFalsy();
    });

    it('onNext is called when provided with Context and "real" onNext handler', async () => {
        const wizardOnNext = jest.fn();
        const Wrapper = getWrapper({
            onNext: wizardOnNext
        });
        const onNext = jest.fn((context, innerOnNext) => {
            expect(context).toBe(policyWizardContext);
            expect(wizardOnNext).toBe(innerOnNext);
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' } onNext={ onNext }/>, {
            wrapper: Wrapper
        });

        expect(onNext).toHaveBeenCalledTimes(0);
        await userEvent.click(screen.getByText(/Next/i));
        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('Back is disabled when step with id === 0', () => {
        const Wrapper = getWrapper({
            id: 0
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Back/i)).toBeDisabled();
    });

    it('Back is enabled when not loading and on step with id != 0', () => {
        const Wrapper = getWrapper({
            id: 5
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Back/i)).toBeEnabled();
    });

    it('Back is disabled when loading', () => {
        const Wrapper = getWrapper();
        render(<PolicyWizardFooter isLoading={ true } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Back/i)).toBeDisabled();
    });

    it('onNext is called when clicking Next', async () => {
        const onNext = jest.fn();
        const Wrapper = getWrapper({
            onNext
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        await userEvent.click(screen.getByText(/Next/i));
        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('onBack is called when clicking Back', async () => {
        const onBack = jest.fn();
        const Wrapper = getWrapper({
            onBack,
            id: 5
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        await userEvent.click(screen.getByText(/Back/i));
        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('onClose is called when clicking Cancel', async () => {
        const onClose = jest.fn();
        const Wrapper = getWrapper({
            onClose
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        await userEvent.click(screen.getByText(/Cancel/i));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('currentStep.enableNext controls if next button is enabled when loading is false', async () => {
        const Wrapper = getWrapper({
            enableNext: false
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.getByText(/Next/i)).toBeDisabled();
    });

    it('currentStep.nextButtonText controls text of next button', async () => {
        const Wrapper = getWrapper({
            nextButtonText: 'Go!'
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Next/i)).toBeFalsy();
        expect(screen.getByText('Go!')).toBeTruthy();
    });

    it('currentStep.hideBackButton controls if back button is show', async () => {
        const Wrapper = getWrapper({
            hideBackButton: true
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Back/i)).toBeFalsy();
    });

    it('currentStep.hideCancelButton controls if cancel button is show', async () => {
        const Wrapper = getWrapper({
            hideCancelButton: true
        });
        render(<PolicyWizardFooter isLoading={ false } loadingText={ 'Loading 123' }/>, {
            wrapper: Wrapper
        });

        expect(screen.queryByText(/Cancel/i)).toBeFalsy();
    });
});
