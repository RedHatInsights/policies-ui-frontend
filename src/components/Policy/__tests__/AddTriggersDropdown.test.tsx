import * as React from 'react';
import { render, fireEvent, getByText, act } from '@testing-library/react';
import { AddTriggersDropdown } from '../AddTriggersDropdown';
import { ActionType } from '../../../types/Policy/Actions';

describe('src/components/Policy/AddTriggersDropdown', () => {

    const mockInsightsIsBeta = (isBeta: boolean) => {
        (global as any).insights = {
            chrome: {
                isBeta: jest.fn(() => isBeta)
            }
        };
    };

    beforeEach(() => {
        (global as any).insights = undefined;
    });

    it('should show hooks and email in beta', async () => {
        mockInsightsIsBeta(true);
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />);

        act(() => {
            fireEvent(
                getByText(element.container, 'Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(element.queryByText(/Hook/i)).toBeTruthy();
        expect(element.queryByText(/Email/i)).toBeTruthy();
    });

    it('should only show email in non beta', async () => {
        mockInsightsIsBeta(false);
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />);

        act(() => {
            fireEvent(
                getByText(element.container, 'Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(element.queryByText(/Hook/i)).toBeFalsy();
        expect(element.queryByText(/Email/i)).toBeTruthy();
    });

    it('should disable type if isTypeEnabled returns false', () => {
        mockInsightsIsBeta(false);
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn((t) => t !== ActionType.EMAIL) }
            onTypeSelected={ jest.fn() }
        />);
        act(() => {
            fireEvent(
                getByText(element.container, 'Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(element.queryByText(/Email/i)?.className).toContain('pf-m-disabled');
    });

    it('should call onTypeSelected when clicking over an active type', () => {
        mockInsightsIsBeta(true);
        const onTypeSelected = jest.fn();
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ onTypeSelected }
        />);
        act(() => {
            fireEvent(
                getByText(element.container, 'Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });
        act(() => {
            fireEvent(
                getByText(element.container, /Hook/),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(onTypeSelected.mock.calls.length).toBe(1);
        expect(onTypeSelected.mock.calls[0][0]).toBe(ActionType.WEBHOOK);
    });

    it('should not call onTypeSelected when clicking over a disabled type', () => {
        mockInsightsIsBeta(true);
        const onTypeSelected = jest.fn();
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => false) }
            onTypeSelected={ onTypeSelected }
        />);
        act(() => {
            fireEvent(
                getByText(element.container, 'Add trigger actions'),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });
        act(() => {
            fireEvent(
                getByText(element.container, /Hook/),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(onTypeSelected.mock.calls.length).toBe(0);
    });

});
