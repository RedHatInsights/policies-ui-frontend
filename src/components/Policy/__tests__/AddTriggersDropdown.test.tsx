import { act, fireEvent, getByText, render } from '@testing-library/react';
import * as React from 'react';

import { ActionType } from '../../../types/Policy/Actions';
import { AddTriggersDropdown } from '../AddTriggersDropdown';

describe('src/components/Policy/AddTriggersDropdown', () => {

    const mockInsightsIsProd = (isProd: boolean) => {
        (global as any).insights = {
            chrome: {
                isProd
            }
        };
    };

    beforeEach(() => {
        (global as any).insights = undefined;
        mockInsightsIsProd(true);
    });

    it('should show email in prod', async () => {
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

        expect(element.queryByText(/Notification/i)).toBeFalsy();
        expect(element.queryByText(/Email/i)).toBeTruthy();
    });

    it('should show email and webhook in non prod', async () => {
        mockInsightsIsProd(false);
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

        expect(element.queryByText(/Notification/i)).toBeTruthy();
        expect(element.queryByText(/Email/i)).toBeTruthy();
    });

    it('should disable type if isTypeEnabled returns false', () => {
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
                getByText(element.container, /Email/),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(onTypeSelected.mock.calls.length).toBe(1);
        expect(onTypeSelected.mock.calls[0][0]).toBe(ActionType.EMAIL);
    });

    it('should not call onTypeSelected when clicking over a disabled type', () => {
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
                getByText(element.container, /Email/),
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });

        expect(onTypeSelected.mock.calls.length).toBe(0);
    });

});
