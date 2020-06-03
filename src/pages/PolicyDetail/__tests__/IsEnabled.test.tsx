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
            isEnabled={ true }
            loading={ false }
        />);
        expect(screen.getByText('Enabled')).toBeVisible();
    });

    it('Renders "Disabled" if isEnabled is false', () => {
        render(<PolicyDetailIsEnabled
            isEnabled={ false }
            loading={ false }
        />);
        expect(screen.getByText('Disabled')).toBeVisible();
    });

    it('Loading is show when loading is true', () => {
        mockMutation(true);
        render(<PolicyDetailIsEnabled
            loading={ true }
            isEnabled={ true }
        />);
        expect(screen.getByTestId('loading')).toBeVisible();
    });
});

