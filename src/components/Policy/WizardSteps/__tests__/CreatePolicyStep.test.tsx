import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock, { UNMATCHED } from 'fetch-mock';
import { createPolicyStep, CreatePolicyStep } from '../CreatePolicyStep';
import { Formik } from 'formik';
import { CreatePolicyStepContextProvider, defaultPerPage } from '../CreatePolicyPolicyStep/Provider';
import { pageToQuery, Page } from 'common-code-ui';
import { ClientContextProvider, createClient } from 'react-fetching-library';
import { act } from 'react-dom/test-utils';
import { WizardContext } from '../../PolicyWizardTypes';
import { PagedServerPolicyResponse } from '../../../../types/Policy/Policy';
import { FormTextInput } from 'common-code-ui';
import { actionGetPolicies } from '../../../../generated/ActionCreators';
import { useState } from 'react';

jest.mock('common-code-ui', () => {
    const real = jest.requireActual('common-code-ui');
    return {
        ...real,
        useUrlState: (p) => useState(p)
    };
});
describe('src/components/Policy/WizardSteps/CreatePolicyStep', () => {

    const client = createClient();

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
                actions: 'email'
            }
        ]
    };

    const mockPoliciesRequest = () => {
        fetchMock.getOnce(
            actionGetPolicies(pageToQuery(Page.of(Page.defaultPage().index, defaultPerPage)))
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
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
        });

        expect(screen.queryByText('This is my policy')).toBeFalsy();
    });

    it('CopyFromPolicy table is show when selecting the radio "as a copy of existing Policy"', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        expect(screen.getByText('This is my policy')).toBeTruthy();
    });

    it('Sets the value of the selected policy', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep/>
                <FormTextInput id="my-test-name" data-testid="name" name="name"/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        expect(
            (screen.getByTestId('name') as HTMLInputElement).value
        ).toBe('Copy of This is my policy');
    });

    it('Selecting from-scratch, cleans the values', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep/>
                <FormTextInput id="my-test-name" data-testid="name" name="name"/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/From scratch/i));
        });

        expect(
            (screen.getByTestId('name') as HTMLInputElement).value
        ).toBe('');
    });

    it('Selecting as-copy, makes isValid "false"', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep/>
                <FormTextInput id="my-test-isValid" data-testid="isValid" name="isValid"/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        expect(
            (screen.getByTestId('isValid') as HTMLInputElement).value
        ).toBe('false');
    });

    it('Selecting as-copy and a row, makes isValid "true"', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep/>
                <FormTextInput id="my-test-isValid" data-testid="isValid" name="isValid"/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        await act(async () => {
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
                <CreatePolicyStep/>
                <FormTextInput id="my-test-isValid" data-testid="isValid" name="isValid"/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/From scratch/i));
        });

        expect(
            (screen.getByTestId('isValid') as HTMLInputElement).value
        ).toBe('true');
    });

    it('When table is shown, clicking "from-scratch" clears the selection', async () => {
        mockPoliciesRequest();
        render(
            <MockContainer>
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        expect(screen.getByText('This is my policy')).toBeTruthy();

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        expect(
            (screen.getByLabelText(/Radio select for policy This is my policy/i) as HTMLInputElement)
        ).toBeChecked();

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/From scratch/i));
        });

        expect(screen.queryByText('This is my policy')).toBeFalsy();

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        expect(screen.getByText('This is my policy')).toBeTruthy();
        expect(
            (screen.getByLabelText(/Radio select for policy This is my policy/i) as HTMLInputElement)
        ).not.toBeChecked();
    });

    it('maxStep is set to 0 when we select as-a-copy', async () => {
        mockPoliciesRequest();
        const setMaxStep = jest.fn();
        render(
            <MockContainer setMaxStep={ setMaxStep }>
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        expect(setMaxStep).toBeCalledTimes(1);
        expect(setMaxStep).toHaveBeenLastCalledWith(0);
    });

    it('maxStep is set to 0 when we select a row', async () => {
        mockPoliciesRequest();
        const setMaxStep = jest.fn();
        render(
            <MockContainer setMaxStep={ setMaxStep }>
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        expect(setMaxStep).toBeCalledTimes(2);
        expect(setMaxStep).toHaveBeenLastCalledWith(0);
    });

    it('maxStep is set to 0 when we select from scratch', async () => {
        mockPoliciesRequest();
        const setMaxStep = jest.fn();
        render(
            <MockContainer setMaxStep={ setMaxStep }>
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/From scratch/i));
        });

        expect(setMaxStep).toBeCalledTimes(3);
        expect(setMaxStep).toHaveBeenLastCalledWith(0);
    });

    it('Sets a verifyResponse when selecting a row', async () => {
        mockPoliciesRequest();
        const setVerifyResponse = jest.fn();
        render(
            <MockContainer setVerifyResponse={ setVerifyResponse }>
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        expect(setVerifyResponse).toBeCalledTimes(0);

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        expect(setVerifyResponse).toBeCalledTimes(1);
        expect(setVerifyResponse.mock.calls[0][0].isValid).toBe(true);
    });

    it('Selecting from-scratch does not call setVerifyResponse', async () => {
        mockPoliciesRequest();
        const setVerifyResponse = jest.fn();
        render(
            <MockContainer setVerifyResponse={ setVerifyResponse }>
                <CreatePolicyStep/>
            </MockContainer>
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/as a copy of existing policy/i));
        });

        expect(setVerifyResponse).toBeCalledTimes(0);

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/Radio select for policy This is my policy/i));
        });

        expect(setVerifyResponse).toBeCalledTimes(1);

        await act(async () => {
            await userEvent.click(screen.getByLabelText(/From scratch/i));
        });

        expect(setVerifyResponse).toBeCalledTimes(1);
    });
});
