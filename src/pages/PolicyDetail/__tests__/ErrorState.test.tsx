import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PolicyDetailErrorState } from '../ErrorState';

describe('src/pages/PolicyDetail/ErrorState', () => {
    it('Renders the passed policyId', () => {
        render(<PolicyDetailErrorState
            action={ jest.fn () }
            error="foo-error"
            policyId="foo-policy-id"
        />);
        expect(screen.getByText(/foo-policy-id/i)).toBeVisible();
    });

    it('Renders the passed error', () => {
        render(<PolicyDetailErrorState
            action={ jest.fn () }
            error="foo-error"
            policyId="foo-policy-id"
        />);
        expect(screen.getByText(/foo-error/i)).toBeVisible();
    });

    it('Calls the action when clicking the button', () => {
        const action = jest.fn();
        render(<PolicyDetailErrorState
            action={ action }
            error="foo-error"
            policyId="foo-policy-id"
        />);

        userEvent.click(screen.getByRole('button'));
        expect(action).toHaveBeenCalled();
    });
});
