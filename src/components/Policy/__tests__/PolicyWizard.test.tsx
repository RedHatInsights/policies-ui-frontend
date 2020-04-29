import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PolicyWizard } from '../PolicyWizard';

jest.mock('../../../utils/Insights');
jest.mock('../../../hooks/useUrlState');

describe('src/components/Policy/PolicyWizard', () => {

    it('Title is "Create a Policy" when not editing', async () => {
        jest.useFakeTimers();
        render(
            <PolicyWizard
                initialValue={ {} }
                onClose={ jest.fn() }
                onSave={ jest.fn() }
                onVerify={ jest.fn() }
                isLoading={ false }
                showCreateStep={ true }
                isEditing={ false }
            />
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        const title = screen.getByRole('heading', { name: /Create a policy/i });
        expect(title).toBeTruthy();
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
                isLoading={ false }
                showCreateStep={ true }
                isEditing={ true }
            />
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        const title = screen.getByRole('heading', { name: /Edit a policy/i });
        expect(title).toBeTruthy();
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

        expect(title).toBeTruthy();
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

        expect(createPolicyTitle).toBeFalsy();

        const policyDetailsTitle = screen.getByText('Policy Details', {
            selector: 'h4'
        });

        expect(policyDetailsTitle).toBeTruthy();
        expect(policyDetailsTitle.className.includes('pf-c-title')).toBeTruthy();

    });

});
