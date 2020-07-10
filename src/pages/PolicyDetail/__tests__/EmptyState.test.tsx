import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PolicyDetailEmptyState } from '../EmptyState';
import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../test/AppWrapper';

describe('src/pages/PolicyDetail/EmptyState', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Renders the passed policyId', () => {
        const AppWrapper = getConfiguredAppWrapper();
        render(<PolicyDetailEmptyState policyId="foo-policy-id"/>, {
            wrapper: AppWrapper
        });
        expect(screen.getByText(/foo-policy-id/i)).toBeVisible();
    });

    it('Goes to list page when clicking the button', async () => {
        const getLocation = jest.fn();
        const AppWrapper = getConfiguredAppWrapper({
            getLocation
        });
        render(<PolicyDetailEmptyState policyId="foo-policy-id"/>, {
            wrapper: AppWrapper
        });

        await userEvent.click(screen.getByRole('button'));
        expect(getLocation().pathname).toBe('/list');
    });
});
