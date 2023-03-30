import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';

import { ActionType } from '../../../types/Policy/Actions';
import { AddTriggersDropdown } from '../AddTriggersDropdown';

describe('src/components/Policy/AddTriggersDropdown', () => {

    const mockInsights = (isFedramp: boolean, isStage: boolean) => {
        (global as any).insights = {
            chrome: {
                getEnvironment: () => isFedramp ? isStage ? 'govStage' : 'gov' : isStage ? 'stage' : 'prod',
                isBeta: () => false
            }
        };
    };

    beforeEach(() => {
        (global as any).insights = undefined;
        mockInsights(false, false);
    });

    it('should show only notification in prod', async () => {
        mockInsights(false, false);
        render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />);

        act(() => {
            fireEvent(
                screen.getByText('Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(screen.queryByText(/Notification/i)).toBeInTheDocument();
        expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/No available trigger actions/i)).not.toBeInTheDocument();
    });

    it('should show only notification in stage', async () => {
        mockInsights(false, true);
        render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />);

        act(() => {
            fireEvent(
                screen.getByText('Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(screen.queryByText(/Notification/i)).toBeInTheDocument();
        expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/No available trigger actions/i)).not.toBeInTheDocument();
    });

    it('should show only notification in fedramp prod', async () => {
        mockInsights(true, false);
        render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />);

        act(() => {
            fireEvent(
                screen.getByText('Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(screen.queryByText(/Notification/i)).toBeInTheDocument();
        expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/No available trigger actions/i)).not.toBeInTheDocument();
    });

    it('should show only notification in fedramp stage', async () => {
        mockInsights(true, true);
        render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />);

        act(() => {
            fireEvent(
                screen.getByText('Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(screen.queryByText(/Notification/i)).toBeInTheDocument();
        expect(screen.queryByText(/Email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/No available trigger actions/i)).not.toBeInTheDocument();
    });

    it('should disable type if isTypeEnabled returns false', () => {
        render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn((t) => t !== ActionType.NOTIFICATION) }
            onTypeSelected={ jest.fn() }
        />);
        act(() => {
            fireEvent(
                screen.getByText('Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(screen.queryByText(/Notification/i)?.className).toContain('pf-m-disabled');
    });

    it('should call onTypeSelected when clicking over an active type', () => {
        const onTypeSelected = jest.fn();
        render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ onTypeSelected }
        />);
        act(() => {
            fireEvent(
                screen.getByText('Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });
        act(() => {
            fireEvent(
                screen.getByText(/Notification/),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(onTypeSelected.mock.calls.length).toBe(1);
        expect(onTypeSelected.mock.calls[0][0]).toBe(ActionType.NOTIFICATION);
    });

    it('should not call onTypeSelected when clicking over a disabled type', () => {
        const onTypeSelected = jest.fn();
        render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => false) }
            onTypeSelected={ onTypeSelected }
        />);
        act(() => {
            fireEvent(
                screen.getByText('Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });
        act(() => {
            fireEvent(
                screen.getByText(/Notification/),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(onTypeSelected.mock.calls.length).toBe(0);
    });

});
