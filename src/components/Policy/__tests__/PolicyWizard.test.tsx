import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockInsights } from 'insights-common-typescript-dev';
import * as React from 'react';
import { useState } from 'react';

import { PolicyWizard } from '../PolicyWizard';

jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
    const real = jest.requireActual('@redhat-cloud-services/insights-common-typescript');
    return {
        ...real,
        useUrlState: (p) => useState(p)
    };
});
describe('src/components/Policy/PolicyWizard', () => {

    beforeAll(() => {
        mockInsights();
    });

    it('Title is "Create a Policy" when not editing', async () => {
        jest.useFakeTimers();
        render(
            <PolicyWizard
                initialValue={ {} }
                onClose={ jest.fn() }
                onSave={ jest.fn() }
                onVerify={ jest.fn() }
                onValidateName={ jest.fn() }
                isLoading={ false }
                showCreateStep={ true }
                isEditing={ false }
            />
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        const title = screen.getByRole('heading', { name: /Create a policy/i });
        expect(title).toBeInTheDocument();
        expect(title.id.startsWith('pf-wizard-title-')).toBeTruthy();
    });

    it('Title is "Edit a policy" when editing', async () => {
        jest.useFakeTimers();
        render(
            <PolicyWizard
                initialValue={ {} }
                onClose={ jest.fn() }
                onSave={ jest.fn() }
                onVerify={ jest.fn() }
                onValidateName={ jest.fn() }
                isLoading={ false }
                showCreateStep={ true }
                isEditing={ true }
            />
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        const title = screen.getByRole('heading', { name: /Edit a policy/i });
        expect(title).toBeInTheDocument();
        expect(title.id.startsWith('pf-wizard-title-')).toBeTruthy();
    });

    it('First step is "Create policy" when showCreateStep is true', async () => {
        jest.useFakeTimers();
        render(
            <PolicyWizard
                initialValue={ {} }
                onClose={ jest.fn() }
                onSave={ jest.fn() }
                onVerify={ jest.fn() }
                onValidateName={ jest.fn() }
                isLoading={ false }
                showCreateStep={ true }
                isEditing={ false }
            />
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        const title = screen.getByText('Create Policy', {
            selector: 'h4'
        });

        expect(title).toBeInTheDocument();
        expect(title.className.includes('pf-c-title')).toBeTruthy();
    });

    it('First step is "Policy Details" when showCreateStep is false and "Create Policy" does not appear', async () => {
        jest.useFakeTimers();
        render(
            <PolicyWizard
                initialValue={ {} }
                onClose={ jest.fn() }
                onSave={ jest.fn() }
                onVerify={ jest.fn() }
                onValidateName={ jest.fn() }
                isLoading={ false }
                showCreateStep={ false }
                isEditing={ false }
            />
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        const createPolicyTitle = screen.queryByText('Create Policy', {
            selector: 'h4'
        });

        expect(createPolicyTitle).not.toBeInTheDocument();

        const policyDetailsTitle = screen.getByText('Policy Details', {
            selector: 'h4'
        });

        expect(policyDetailsTitle).toBeInTheDocument();
        expect(policyDetailsTitle.className.includes('pf-c-title')).toBeTruthy();

    });

    describe('Policy Details', () => {
        it('Next is disabled when no name is set', async () => {
            jest.useFakeTimers();
            render(
                <PolicyWizard
                    initialValue={ {} }
                    onClose={ jest.fn() }
                    onSave={ jest.fn() }
                    onVerify={ jest.fn() }
                    onValidateName={ jest.fn() }
                    isLoading={ false }
                    showCreateStep={ false }
                    isEditing={ false }
                />
            );

            await act(async () => {
                await jest.runAllTimers();
            });

            expect(screen.getByText(/next/i)).toBeDisabled();
        });

        it('Next is enabled when name is set', async () => {
            jest.useFakeTimers();
            render(
                <PolicyWizard
                    initialValue={ {} }
                    onClose={ jest.fn() }
                    onSave={ jest.fn() }
                    onVerify={ jest.fn() }
                    onValidateName={ jest.fn() }
                    isLoading={ false }
                    showCreateStep={ false }
                    isEditing={ false }
                />
            );

            await act(async () => {
                await jest.runAllTimers();
            });

            await act(async () => {
                await userEvent.type(screen.getByLabelText(/name/i), 'foo');
            });

            expect(screen.getByText(/next/i)).toBeEnabled();
        });

        it('Next will trigger a call to onValidateName', async () => {
            jest.useFakeTimers();
            const onValidateName = jest.fn(() => Promise.resolve({ created: false }));
            render(
                <PolicyWizard
                    initialValue={ {} }
                    onClose={ jest.fn() }
                    onSave={ jest.fn() }
                    onVerify={ jest.fn() }
                    onValidateName={ onValidateName }
                    isLoading={ false }
                    showCreateStep={ false }
                    isEditing={ false }
                />
            );

            await act(async () => {
                await jest.runAllTimers();
            });

            expect(onValidateName).toBeCalledTimes(0);

            await act(async () => {
                await userEvent.type(screen.getByLabelText(/name/i), 'foo');
            });

            await act(async () => {
                await userEvent.click(screen.getByText(/next/i));
            });

            expect(onValidateName).toBeCalledTimes(1);
        });

        it('Next will move to next page if validate response does not have an error', async () => {
            jest.useFakeTimers();
            const onValidateName = jest.fn(() => Promise.resolve({ created: false }));
            render(
                <PolicyWizard
                    initialValue={ {} }
                    onClose={ jest.fn() }
                    onSave={ jest.fn() }
                    onVerify={ jest.fn() }
                    onValidateName={ onValidateName }
                    isLoading={ false }
                    showCreateStep={ false }
                    isEditing={ false }
                />
            );

            await act(async () => {
                await jest.runAllTimers();
            });

            expect(onValidateName).toBeCalledTimes(0);

            await act(async () => {
                await userEvent.type(screen.getByLabelText(/name/i), 'foo');
            });

            await act(async () => {
                await userEvent.click(screen.getByText(/next/i));
            });

            const policyDetailsTitle = screen.queryByText('Policy Details', {
                selector: 'h4'
            });
            expect(policyDetailsTitle).not.toBeInTheDocument();
            expect(onValidateName).toBeCalledTimes(1);
        });

        it('Next will not move to next page if validate response has an error', async () => {
            jest.useFakeTimers();
            const onValidateName = jest.fn(() => Promise.resolve({ created: false, error: 'invalid name' }));
            render(
                <PolicyWizard
                    initialValue={ {} }
                    onClose={ jest.fn() }
                    onSave={ jest.fn() }
                    onVerify={ jest.fn() }
                    onValidateName={ onValidateName }
                    isLoading={ false }
                    showCreateStep={ false }
                    isEditing={ false }
                />
            );

            await act(async () => {
                await jest.runAllTimers();
            });

            expect(onValidateName).toBeCalledTimes(0);

            await act(async () => {
                await userEvent.type(screen.getByLabelText(/name/i), 'foo');
            });

            await act(async () => {
                await userEvent.click(screen.getByText(/next/i));
            });

            const policyDetailsTitle = screen.queryByText('Policy Details', {
                selector: 'h4'
            });
            expect(policyDetailsTitle).toBeInTheDocument();
            expect(onValidateName).toBeCalledTimes(1);
        });
    });

});
