import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PolicyDetailIsEnabled } from '../IsEnabled';
import { useMassChangePolicyEnabledMutation } from '../../../services/useMassChangePolicyEnabled';

jest.mock('../../../services/useMassChangePolicyEnabled');

describe('src/pages/PolicyDetail/IsEnabled', () => {

    const mockMutation = (loading: boolean) => {
        const mutate = jest.fn();
        mutate.mockImplementation(() => Promise.resolve());
        (useMassChangePolicyEnabledMutation as jest.Mock).mockImplementation(() => {
            return {
                mutate,
                loading
            };
        });
        return mutate;
    };

    beforeEach(() => {
        mockMutation(false);
    });

    it('Renders "Enabled" if isEnabled is true', () => {
        render(<PolicyDetailIsEnabled
            policyId={ 'foo-id' }
            isEnabled={ true }
            statusChanged={ jest.fn() }
        />);
        expect(screen.getByText('Enabled')).toBeVisible();
    });

    it('Renders "Disabled" if isEnabled is false', () => {
        render(<PolicyDetailIsEnabled
            policyId={ 'foo-id' }
            isEnabled={ false }
            statusChanged={ jest.fn() }
        />);
        expect(screen.getByText('Disabled')).toBeVisible();
    });

    it('Renders button to disable policies when isEnabled is true', () => {
        render(<PolicyDetailIsEnabled
            policyId={ 'foo-id' }
            isEnabled={ true }
            statusChanged={ jest.fn() }
        />);
        expect(screen.getByText('Disable policy')).toBeVisible();
    });

    it('Renders button to enable policies when isEnabled is false', () => {
        render(<PolicyDetailIsEnabled
            policyId={ 'foo-id' }
            isEnabled={ false }
            statusChanged={ jest.fn() }
        />);
        expect(screen.getByText('Enable policy')).toBeVisible();
    });

    it('policyId and !isEnabled is passed to the mutation when clicking the link', () => {
        const mutation = mockMutation(false);
        render(<PolicyDetailIsEnabled
            policyId={ 'foo-id' }
            isEnabled={ true }
            statusChanged={ jest.fn() }
        />);
        userEvent.click(screen.getByRole('button'));
        expect(mutation).toHaveBeenCalledWith({
            policyIds: [ 'foo-id' ],
            shouldBeEnabled: false
        });
    });

    it('Loading is show when fetching', () => {
        mockMutation(true);
        render(<PolicyDetailIsEnabled
            policyId={ 'foo-id' }
            isEnabled={ true }
            statusChanged={ jest.fn() }
        />);
        expect(screen.getByTestId('loading')).toBeVisible();
    });

    it('Status changed is called when finished the isEnabled change with the new isEnabled value', async () => {
        const statusChanged = jest.fn();
        render(<PolicyDetailIsEnabled
            policyId={ 'foo-id' }
            isEnabled={ true }
            statusChanged={ statusChanged }
        />);
        userEvent.click(screen.getByRole('button'));
        await act(async () => {

        });
        expect(statusChanged).toHaveBeenCalledWith(false);
    });
});
