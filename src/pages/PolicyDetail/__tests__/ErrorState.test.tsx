import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { PolicyDetailErrorState } from '../ErrorState';

describe('src/pages/PolicyDetail/ErrorState', () => {
    it('Renders the passed error', async() => {
        render(<PolicyDetailErrorState
            action={ jest.fn () }
            error="foo-error"
        />);
        expect(screen.getByText(/foo-error/i)).toBeVisible();
    });

    it('Calls the action when clicking the button', async () => {
        const action = jest.fn();
        render(<PolicyDetailErrorState
            action={ action }
            error="foo-error"
        />);

        await userEvent.click(screen.getByRole('button'));
        expect(action).toHaveBeenCalled();
    });
});
