import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { CreatePolicyWizard } from '../CreatePolicyWizard';
import { PolicyWizardProps } from '../../../components/Policy/PolicyWizard';
import { ClientContextProvider, createClient } from 'react-fetching-library';
import fetchMock, { UNMATCHED } from 'fetch-mock';
import { formatConditionError } from '../CreatePolicyWizard';
import { useFacts } from '../../../hooks/useFacts';
import { addSuccessNotification } from 'common-code-ui';
jest.mock('common-code-ui', () => {
    const real = jest.requireActual('common-code-ui');
    return {
        ...real,
        addSuccessNotification: jest.fn(() => {})
    };
});

jest.mock('../../../components/Policy/PolicyWizard', () => ({
    PolicyWizard: jest.fn()
}));
jest.mock('../../../hooks/useFacts');

const configurePolicyWizard = (implementation: React.FunctionComponent<PolicyWizardProps>) => {
    const mock = jest.requireMock('../../../components/Policy/PolicyWizard').PolicyWizard;
    mock.mockImplementation(implementation);
};

describe('src/pages/ListPage/CreatePolicyWizard', () => {

    const Wrapper: React.FunctionComponent = (props) => {
        return <ClientContextProvider client={ createClient() }>{ props.children }</ClientContextProvider>;
    };

    const failIfNoHttpCallMatched = () => {
        const calls = fetchMock.calls(UNMATCHED).filter(c => c.isUnmatched);
        if (calls.length > 0) {
            throw new Error(`Found ${ calls.length } unmatched calls, maybe you forgot to mock? : ${calls.map(c => c.request?.url || c['0'])}`);
        }
    };

    beforeEach(() => {
        fetchMock.restore();
        (useFacts as jest.Mock).mockImplementation(() => []);
        (addSuccessNotification as jest.Mock).mockRestore();
    });

    afterEach(() => {
        failIfNoHttpCallMatched();
    });

    it('PolicyWizard is rendered if isOpen is true', async () => {
        configurePolicyWizard(() => {
            return <>hello world</>;
        });

        render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
            wrapper: Wrapper
        });
        expect(screen.queryByText(/hello world/i)).toBeTruthy();
    });

    it('PolicyWizard is not rendered if isOpen is false', async () => {
        configurePolicyWizard(() => {
            return <>hello world</>;
        });

        render(<CreatePolicyWizard isOpen={ false } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
            wrapper: Wrapper
        });
        expect(screen.queryByText(/hello world/i)).toBeFalsy();
    });

    it('formatConditionError strips "lines 1" and adds 1 to positions', () => {
        expect(
            formatConditionError(
                'Validation failed: Invalid expression: mismatched input \'123\' expecting {\'(\', NOT, NEG, SIMPLETEXT} at line 1 position 0'
            )
        ).toBe('Validation failed: Invalid expression: mismatched input \'123\' expecting {\'(\', NOT, NEG, SIMPLETEXT} at position 1');
        expect(
            formatConditionError(
                'Validation failed: Invalid expression: token recognition error at: \'\\\' at line 1 position 0'
            )
        ).toBe('Validation failed: Invalid expression: token recognition error at: \'\\\' at position 1');

        expect(
            formatConditionError(
                'Validation failed: Invalid expression: token recognition error at: \'\\\' at line 1 position 5'
            )
        ).toBe('Validation failed: Invalid expression: token recognition error at: \'\\\' at position 6');
    });

    describe('onSave', () => {
        it('Created is true if creating a policy and server returns 200', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.post(
                '/api/policies/v1.0/policies?alsoStore=true',
                {
                    headers: {},
                    status: 200
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                });
                expect(result).toEqual({
                    created: true
                });
            });
        });

        it('Created is true if creating a policy and server returns 201', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.post(
                '/api/policies/v1.0/policies?alsoStore=true',
                {
                    headers: {},
                    status: 201
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                });
                expect(result).toEqual({
                    created: true
                });
            });
        });

        it('Created is true if editing a policy and server returns 200', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.put(
                '/api/policies/v1.0/policies/abcd',
                {
                    headers: {},
                    status: 200
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'abcd'
                });
                expect(result).toEqual({
                    created: true
                });
            });
        });

        it('Created is true if editing a policy and server returns 201', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.put(
                '/api/policies/v1.0/policies/abcd',
                {
                    headers: {},
                    status: 201
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'abcd'
                });
                expect(result).toEqual({
                    created: true
                });
            });
        });

        it('Calls props.close with the policy when the policy is created / saved', async () => {
            const trigger = jest.fn();
            configurePolicyWizard(props => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.post(
                '/api/policies/v1.0/policies?alsoStore=true',
                {
                    headers: {},
                    status: 201,
                    body: {
                        id: '1234',
                        name: 'foo',
                        mtime: 1,
                        ctime: 1,
                        isEnabled: false,
                        description: ''
                    }
                }
            );

            const closeFn = jest.fn();

            render(<CreatePolicyWizard isOpen={ true } close={ closeFn } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    name: 'my foo'
                });
                expect(result.created).toBe(true);
            });

            expect(closeFn).toHaveBeenCalledWith({
                id: '1234',
                name: 'foo',
                actions: [],
                isEnabled: false,
                lastTriggered: undefined,
                description: '',
                ctime: new Date('1970-01-01T00:00:00.001Z'),
                mtime: new Date('1970-01-01T00:00:00.001Z')
            });
        });

        it('Adds a success notification when a policy is created', async () => {
            const trigger = jest.fn();
            configurePolicyWizard(props => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.post(
                '/api/policies/v1.0/policies?alsoStore=true',
                {
                    headers: {},
                    status: 201
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    name: 'my foo'
                });
                expect(result.created).toBe(true);
            });

            expect(addSuccessNotification).toHaveBeenCalledWith('Created', 'Policy "my foo" created');
        });

        it('Adds a success notification when a policy is edited', async () => {
            const trigger = jest.fn();
            configurePolicyWizard(props => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.put(
                '/api/policies/v1.0/policies/some-id',
                {
                    headers: {},
                    status: 200
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'some-id',
                    name: 'edited'
                });
                expect(result.created).toBe(true);
            });

            expect(addSuccessNotification).toHaveBeenCalledWith('Saved', 'Policy "edited" has been updated');
        });

        it('Returns "This policy cannot be found..." when saving a policy that does not exist or has been deleted (returns 404)', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.put(
                '/api/policies/v1.0/policies/abcd',
                {
                    headers: {},
                    status: 404
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'abcd'
                });
                expect(result).toEqual({
                    created: false,
                    error: 'This policy cannot be found. It may have been deleted by another user. Your changes cannot be saved.'
                });
            });
        });

        it('Returns "Unknown error..." when saving a policy and returns a status different than 200,201 and 404', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onSave);
                return <>hello world</>;
            });
            fetchMock.put(
                '/api/policies/v1.0/policies/abcd',
                {
                    headers: {},
                    status: 555
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'abcd'
                });
                expect(result).toEqual({
                    created: false,
                    error: 'Unknown Error when trying to update the policy: (Code 555)'
                });
            });
        });
    });

    describe('onVerify', () => {
        it('When status is 200, isValid is true and the policy', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onVerify);
                return <>hello world</>;
            });
            fetchMock.post(
                '/api/policies/v1.0/policies/validate',
                {
                    headers: {},
                    status: 200
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'abcd'
                });
                expect(result).toEqual({
                    isValid: true,
                    policy: {
                        id: 'abcd'
                    }
                });
            });
        });

        it('When status is different than 200, isValid is false and we get an error from the payload.msg', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onVerify);
                return <>hello world</>;
            });
            fetchMock.post(
                '/api/policies/v1.0/policies/validate',
                {
                    headers: {},
                    status: 404,
                    body: {
                        msg: 'this is an error from the server'
                    }
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'abcd'
                });
                expect(result).toEqual({
                    isValid: false,
                    error: 'this is an error from the server',
                    policy: {
                        id: 'abcd'
                    }
                });
            });
        });

        it('When status is different than 200, isValid is false and we get an error defined error if no payload.msg found', async () => {
            const trigger = jest.fn();
            configurePolicyWizard((props) => {
                trigger.mockImplementation(props.onVerify);
                return <>hello world</>;
            });
            fetchMock.post(
                '/api/policies/v1.0/policies/validate',
                {
                    headers: {},
                    status: 404
                }
            );

            render(<CreatePolicyWizard isOpen={ true } close={ jest.fn() } showCreateStep={ false } isEditing={ true }/>, {
                wrapper: Wrapper
            });

            await act(async () => {
                const result = await trigger({
                    id: 'abcd'
                });
                expect(result).toEqual({
                    isValid: false,
                    error: 'Unknown Error when trying to validate: (Code 404)',
                    policy: {
                        id: 'abcd'
                    }
                });
            });
        });
    });
});
