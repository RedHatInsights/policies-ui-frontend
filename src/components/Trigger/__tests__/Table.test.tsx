import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { TriggerTable } from '../Table';

describe('src/components/Trigger/Table', () => {
    it('renders empty state when no rows', () => {
        render(<TriggerTable/>);
        expect(screen.getByText('No matching triggers found')).toBeVisible();
    });

    it('renders loading when loading is true', () => {
        render(<TriggerTable loading={ true }/>);
        expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'Loading');
    });

    it('renders triggers passed', () => {
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(1590700836387)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1590606990814)
                }
            ] }
        />);
        expect(screen.getByText('my-hostname-foo')).toBeTruthy();
        expect(screen.getByText('my-hostname-bar')).toBeTruthy();
        expect(screen.getByText('28 May 2020 21:20:36 UTC')).toBeTruthy();
        expect(screen.getByText('27 May 2020 19:16:30 UTC')).toBeTruthy();
    });

    it('Hostname creates a link to the inventory', () => {
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(1590700836387)
                },
                {
                    id: 'meep',
                    hostName: 'my-hostname-bar',
                    created: new Date(1590606990814)
                }
            ] }
        />);
        expect(screen.getByText('my-hostname-foo').closest('a')).toHaveAttribute('href', '/beta/insights/inventory/foo-id/');
        expect(screen.getByText('my-hostname-bar').closest('a')).toHaveAttribute('href', '/beta/insights/inventory/meep/');
        expect(screen.getByText('28 May 2020 21:20:36 UTC')).toBeTruthy();
        expect(screen.getByText('27 May 2020 19:16:30 UTC')).toBeTruthy();
    });
});
