import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PolicyDetailEmptyState } from '../EmptyState';
import { getRouterWrapper } from '../../../../test/RouterWrapper';

describe('src/pages/PolicyDetail/EmptyState', () => {
    it('Renders the passed policyId', () => {
        const { RouterWrapper } = getRouterWrapper('/');
        render(<PolicyDetailEmptyState policyId="foo-policy-id"/>, {
            wrapper: RouterWrapper
        });
        expect(screen.getByText(/foo-policy-id/i)).toBeVisible();
    });

    it('Goes to list page when clicking the button', async () => {
        const { RouterWrapper, data } = getRouterWrapper('/');
        render(<PolicyDetailEmptyState policyId="foo-policy-id"/>, {
            wrapper: RouterWrapper
        });

        await userEvent.click(screen.getByRole('button'));
        expect(data.location.pathname).toBe('/list');
    });
});
