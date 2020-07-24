import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Direction, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { TriggerTable } from '../Table';

describe('src/components/Trigger/Table', () => {
    it('renders empty state when no rows', () => {
        render(<TriggerTable/>);
        expect(screen.getByText('No matching triggers found')).toBeVisible();
    });

    it('Calls on sort when pressing the Date column', async () => {
        const onSort = jest.fn();
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(123456789)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1234567890)
                }
            ] }
            onSort={ onSort }
        />);

        expect(onSort).toHaveBeenCalledTimes(0);
        await userEvent.click(screen.getByText(/date/i, {
            selector: 'button span'
        }));
        expect(onSort).toHaveBeenCalledWith(0, 'ctime', Direction.ASCENDING);
    });

    it('Calls on sort when pressing the System column', async () => {
        const onSort = jest.fn();
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(123456789)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1234567890)
                }
            ] }
            onSort={ onSort }
        />);

        expect(onSort).toHaveBeenCalledTimes(0);
        await userEvent.click(screen.getByText(/system/i, {
            selector: 'button span'
        }));
        expect(onSort).toHaveBeenCalledWith(1, 'name', Direction.ASCENDING);
    });

    it('When no sort is provided, nothing is sorted', async () => {
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(123456789)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1234567890)
                }
            ] }
        />);

        expect(screen.getByText(/system/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'none');
        expect(screen.getByText(/date/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'none');
    });

    it('Sort by system ascending is reflected in the table', async () => {
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(123456789)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1234567890)
                }
            ] }
            sortBy={ Sort.by('system', Direction.ASCENDING) }
        />);

        expect(screen.getByText(/system/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'ascending');
        expect(screen.getByText(/date/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'none');
    });

    it('Sort by system descending is reflected in the table', async () => {
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(123456789)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1234567890)
                }
            ] }
            sortBy={ Sort.by('system', Direction.DESCENDING) }
        />);

        expect(screen.getByText(/system/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'descending');
        expect(screen.getByText(/date/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'none');
    });

    it('Sort by date ascending is reflected in the table', async () => {
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(123456789)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1234567890)
                }
            ] }
            sortBy={ Sort.by('ctime', Direction.ASCENDING) }
        />);

        expect(screen.getByText(/system/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'none');
        expect(screen.getByText(/date/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'ascending');
    });

    it('Sort by system date is reflected in the table', async () => {
        render(<TriggerTable
            rows={ [
                {
                    id: 'foo-id',
                    hostName: 'my-hostname-foo',
                    created: new Date(123456789)
                },
                {
                    id: 'bar-id',
                    hostName: 'my-hostname-bar',
                    created: new Date(1234567890)
                }
            ] }
            sortBy={ Sort.by('ctime', Direction.DESCENDING) }
        />);

        expect(screen.getByText(/system/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'none');
        expect(screen.getByText(/date/i, {
            selector: 'th span'
        }).closest('th')).toHaveAttribute('aria-sort', 'descending');
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
