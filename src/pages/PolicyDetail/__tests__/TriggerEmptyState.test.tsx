import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { PolicyDetailTriggerEmptyState } from '../TriggerEmptyState';

describe('src/pages/PolicyDetail/TriggerEmptyState', () => {
    it('renders with No recent triggers', () => {
        render(<PolicyDetailTriggerEmptyState />);
        expect(screen.getByText(/No recent triggers/i)).toBeVisible();
    });
});
