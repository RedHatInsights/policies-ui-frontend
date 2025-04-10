import '@testing-library/jest-dom';

import { Page } from '@redhat-cloud-services/insights-common-typescript';
import { FormTextInput } from '@redhat-cloud-services/insights-common-typescript';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock, { UNMATCHED } from 'fetch-mock';
import { Formik } from 'formik';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import * as React from 'react';
import { useState } from 'react';
import { ClientContextProvider, createClient } from 'react-fetching-library';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { Operations } from '../../../../generated/Openapi';
import { PagedServerPolicyResponse } from '../../../../types/Policy/Policy';
import { WizardContext } from '../../PolicyWizardTypes';
import { CreatePolicyStepContextProvider, defaultPerPage } from '../CreatePolicyPolicyStep/Provider';
import { CreatePolicyStep, createPolicyStep } from '../CreatePolicyStep';

jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
    const real = jest.requireActual('@redhat-cloud-services/insights-common-typescript');
    return {
        ...real,
        useUrlState: (p) => useState(p)
    };
});
describe('src/components/Policy/WizardSteps/CreatePolicyStep', () => {

    const client = createClient({
        responseInterceptors: [
            validateSchemaResponseInterceptor
        ]
    });

    interface MockContainerProps {
        setVerifyResponse?: WizardContext['setVerifyResponse'];
        setMaxStep?: WizardContext['setMaxStep'];
    }

    const MockContainer: React.FunctionComponent<MockContainerProps> = (props) => {

        const wizardContext: WizardContext = {
            isLoading: false,
            isFormValid: false,
            triggerAction: jest.fn(),
            verifyResponse: {
                isValid: false,
                policy: undefined,
                error: undefined
            },
            createResponse: {
                error: undefined,
                created: false
            },
            setVerifyResponse: props.setVerifyResponse || jest.fn(),
            facts: [],
            setMaxStep: props.setMaxStep || jest.fn()
        };

        return (
            <ClientContextProvider client={ client }>
                <WizardContext.Provider value={ wizardContext }>
                    <Formik initialValues={ [] } onSubmit={ jest.fn() }>
                        <CreatePolicyStepContextProvider showCreateStep={ true }>
                            {/* eslint-disable-next-line testing-library/no-node-access */}
                            {props.children}
                        </CreatePolicyStepContextProvider>
                    </Formik>
                </WizardContext.Provider>
            </ClientContextProvider>
        );
    };

    const failIfNoHttpCallMatched = () => {
        const calls = fetchMock.calls(UNMATCHED).filter(c => c.isUnmatched);
        if (calls.length > 0) {
            throw new Error(`Found ${ calls.length } unmatched calls, maybe you forgot to mock? : ${calls.map(c => c.request?.url || c['0'])}`);
        }
    };

    const policyListServerResponse: PagedServerPolicyResponse = {
        data: [
            {
                id: '5151-5151',
                name: 'This is my policy',
                description: 'foo description',
                isEnabled: true,
                conditions: '1 == 2',
                actions: 'notification'
            }
        ]
    };

    const mockPoliciesRequest = () => {
        fetchMock.getOnce(
            Operations.GetPolicies.actionCreator(Page.of(Page.defaultPage().index, defaultPerPage).toQuery())
            .endpoint,
            {
                headers: {},
                status: 200,
                body: policyListServerResponse
            }
        );
    };

    beforeEach(() => fetchMock.restore());
    afterEach(() => failIfNoHttpCallMatched());

    it('createPolicyStep allows overrides', () => {
        const result = createPolicyStep({
            name: 'foo',
            validationSchema: undefined
        });
        expect(result.name).toBe('foo');
        expect(result.validationSchema).toBe(undefined);
    });

    it('CopyFromPolicy table is not show by default', async () => {
        render(
            <MockContainer>
                <CreatePolicyStep />
            </MockContainer>
        );

        await waitForAsyncEvents();

        expect(screen.queryByText('This is my policy')).not.toBeInTheDocument();
    });

    it('CopyFromPolicy table is shown when selecting the radio "as a copy of existing Policy"', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await waitFor(() => {
            expect(screen.getByText('This is my policy')).toBeInTheDocument();
        });
    });

    it('Sets the value of the selected policy', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep />
                <FormTextInput id="my-test-name" data-testid="name" name="name" />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await waitFor(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        await waitFor(() => {
            expect(
                (screen.getByTestId('name') as HTMLInputElement).value
            ).toBe('Copy of This is my policy');
        });
    });

    it('Selecting from-scratch, cleans the values', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep />
                <FormTextInput id="my-test-name" data-testid="name" name="name" />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await waitFor(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });
        await waitFor(async() => {
            await userEvent.click(screen.getByLabelText(/From scratch/i));
        });

        await waitFor(() => {
            expect(
                (screen.getByTestId('name') as HTMLInputElement).value
            ).toBe('');
        });
    });

    it('Selecting as-copy, makes isValid "false"', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep />
                <FormTextInput id="my-test-isValid" data-testid="isValid" name="isValid" />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        expect(
            (screen.getByTestId('isValid') as HTMLInputElement).value
        ).toBe('false');
    });

    it('Selecting as-copy and a row, makes isValid "true"', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep />
                <FormTextInput id="my-test-isValid" data-testid="isValid" name="isValid" />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await waitFor(async () =>{
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        expect(
            (screen.getByTestId('isValid') as HTMLInputElement).value
        ).toBe('true');
    });

    it('Selecting from-scratch, makes isValid "true"', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep />
                <FormTextInput id="my-test-isValid" data-testid="isValid" name="isValid" />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await userEvent.click(screen.getByLabelText(/From scratch/i));
        expect(
            (screen.getByTestId('isValid') as HTMLInputElement).value
        ).toBe('true');
    });

    it('When table is shown, clicking "from-scratch" clears the selection', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await waitFor(() => {
            expect(screen.getByText('This is my policy')).toBeInTheDocument();
        });
        await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        expect(
            (screen.getByLabelText(/Radio select for policy This is my policy/i) as HTMLInputElement)
        ).toBeChecked();

        await userEvent.click(screen.getByLabelText(/From scratch/i));
        expect(screen.queryByText('This is my policy')).not.toBeInTheDocument();
        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        expect(screen.getByText('This is my policy')).toBeInTheDocument();
        expect(
            (screen.getByLabelText(/Radio select for policy This is my policy/i) as HTMLInputElement)
        ).not.toBeChecked();
    });

    it('maxStep is set to 0 when we select as-a-copy', async () => {
        mockPoliciesRequest();
        const setMaxStep = jest.fn();
        render(
            <MockContainer setMaxStep={ setMaxStep }>
                <CreatePolicyStep />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        expect(setMaxStep).toHaveBeenCalledTimes(1);
        expect(setMaxStep).toHaveBeenLastCalledWith(0);
    });

    it('maxStep is set to 0 when we select a row', async () => {
        mockPoliciesRequest();
        const setMaxStep = jest.fn();
        render(
            <MockContainer setMaxStep={ setMaxStep }>
                <CreatePolicyStep />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await waitFor(async () =>{
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });
        expect(setMaxStep).toHaveBeenCalledTimes(2);
        expect(setMaxStep).toHaveBeenLastCalledWith(0);
    });

    it('maxStep is set to 0 when we select from scratch', async () => {
        mockPoliciesRequest();
        const setMaxStep = jest.fn();
        render(
            <MockContainer setMaxStep={ setMaxStep }>
                <CreatePolicyStep />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        await waitFor(async () =>{
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });
        await waitFor(async () => {
            await userEvent.click(screen.getByLabelText(/From scratch/i));
        });
        expect(setMaxStep).toHaveBeenCalledTimes(3);
        expect(setMaxStep).toHaveBeenLastCalledWith(0);
    });

    it('Sets a verifyResponse when selecting a row', async () => {
        mockPoliciesRequest();
        const setVerifyResponse = jest.fn();
        render(
            <MockContainer setVerifyResponse={ setVerifyResponse }>
                <CreatePolicyStep />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        expect(setVerifyResponse).toHaveBeenCalledTimes(0);
        await waitFor(async () =>{
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });
        expect(setVerifyResponse).toHaveBeenCalledTimes(1);
        expect(setVerifyResponse.mock.calls[0][0].isValid).toBe(true);
    });

    it('Selecting from-scratch does not call setVerifyResponse', async () => {
        mockPoliciesRequest();
        const setVerifyResponse = jest.fn();
        render(
            <MockContainer setVerifyResponse={ setVerifyResponse }>
                <CreatePolicyStep />
            </MockContainer>
        );

        await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        expect(setVerifyResponse).toHaveBeenCalledTimes(0);

        await waitFor(async () =>{
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });
        expect(setVerifyResponse).toHaveBeenCalledTimes(1);

        await userEvent.click(screen.getByLabelText(/From scratch/i));
        expect(setVerifyResponse).toHaveBeenCalledTimes(1);
    });
});
