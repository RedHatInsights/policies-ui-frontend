import * as React from 'react';
import { render, fireEvent, getByText, act } from '@testing-library/react';
import { AddTriggersDropdown } from '../AddTriggersDropdown';
import { ActionType } from '../../../types/Policy/Actions';
import { AppContext } from '../../../app/AppContext';
import { defaultAppContextSettings } from '../../../../test/AppWrapper';
import { BetaDetector } from '../../Beta/BetaDetector';

describe('src/components/Policy/AddTriggersDropdown', () => {

    const getWrapper = (isBeta: boolean) => {
        const Wrapper = (props) => {
            return (
                <AppContext.Provider value={ {
                    ...defaultAppContextSettings,
                    insights: {
                        chrome: {
                            ...defaultAppContextSettings.insights.chrome,
                            isBeta: jest.fn(() => isBeta)
                        }
                    }
                } }>
                    { props.children }
                </AppContext.Provider>
            );
        };

        return Wrapper;
    };

    it('should show hooks and email in beta', async () => {
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />, {
            wrapper: getWrapper(true)
        });

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
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => true) }
            onTypeSelected={ jest.fn() }
        />, {
            wrapper: getWrapper(false)
        });

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
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn((t) => t !== ActionType.EMAIL) }
            onTypeSelected={ jest.fn() }
        />, {
            wrapper: getWrapper(false)
        });
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
        />, {
            wrapper: getWrapper(true)
        });
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
        const onTypeSelected = jest.fn();
        const element = render(<AddTriggersDropdown
            isTypeEnabled={ jest.fn(() => false) }
            onTypeSelected={ onTypeSelected }
        />, {
            wrapper: getWrapper(true)
        });
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
