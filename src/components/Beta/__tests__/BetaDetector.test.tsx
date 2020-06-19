import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { BetaDetector, BetaIf, BetaIfNot } from '../BetaDetector';
import { AppContext } from '../../../app/AppContext';
import { defaultAppContextSettings } from '../../../../test/AppWrapper';

jest.mock('../../../utils/Insights');

declare const insights;

describe('src/components/Beta', () => {

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

    it('BetaIf renders in beta', () => {
        render(
            <BetaDetector>
                <BetaIf>
                    <div>hello</div>
                </BetaIf>
            </BetaDetector>, {
                wrapper: getWrapper(true)
            }
        );
        expect(screen.queryByText('hello')).toBeTruthy();
    });

    it('BetaIf does not render in non-beta', () => {
        render(
            <BetaDetector>
                <BetaIf>
                    <div>hello</div>
                </BetaIf>
            </BetaDetector>, {
                wrapper: getWrapper(false)
            }
        );
        expect(screen.queryByText('hello')).toBeFalsy();
    });

    it('BetaIfNot does not render in beta', () => {
        render(
            <BetaDetector>
                <BetaIfNot>
                    <div>hello</div>
                </BetaIfNot>
            </BetaDetector>, {
                wrapper: getWrapper(true)
            }
        );
        expect(screen.queryByText('hello')).toBeFalsy();
    });

    it('BetaIfNot renders in non-beta', () => {
        render(
            <BetaDetector>
                <BetaIfNot>
                    <div>hello</div>
                </BetaIfNot>
            </BetaDetector>, {
                wrapper: getWrapper(false)
            }
        );
        expect(screen.queryByText('hello')).toBeTruthy();
    });

    it('Mixing BetaIf and BetaIfNot', () => {
        render(
            <BetaDetector>
                <BetaIf>
                    <div>foo</div>
                </BetaIf>
                <BetaIfNot>
                    <div>hello</div>
                </BetaIfNot>
            </BetaDetector>, {
                wrapper: getWrapper(true)
            }
        );
        expect(screen.queryByText('foo')).toBeTruthy();
        expect(screen.queryByText('hello')).toBeFalsy();
    });

    it('Duplicating throws an error', () => {
        const error = jest.spyOn(console, 'error');
        error.mockImplementation(() => '');

        expect(() => {
            render(
                <BetaDetector>
                    <BetaIf>
                        <div>foo</div>
                    </BetaIf>
                    <BetaIf>
                        <div>hello</div>
                    </BetaIf>
                </BetaDetector>, {
                    wrapper: getWrapper(true)
                }
            );
        }).toThrowError('Only one of each BetaIf and BetaIfNot is allowed on each BetaDetector');
        error.mockRestore();
    });

    it('Other similar tags throw error', () => {
        const error = jest.spyOn(console, 'error');
        error.mockImplementation(() => '');

        expect(() => {
            render(
                <BetaDetector>
                    <div>hello</div>
                </BetaDetector>, {
                    wrapper: getWrapper(true)
                }
            );
        }).toThrowError('Only BetaIf and BetaIfNot are accepted Elements in BetaDecorator');
        error.mockRestore();
    });
});
