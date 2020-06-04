import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { PolicyDetailTriggerEmptyState } from '../TriggerEmptyState';

describe('src/pages/PolicyDetail/TriggerEmptyState', () => {
    it('renders with No triggers found', () => {
        render(<PolicyDetailTriggerEmptyState/>);
        expect(screen.getByText(/No triggers found/i)).toBeVisible();
    });
});
