import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { BetaDetector, BetaIf, BetaIfNot } from '../BetaDetector';

jest.mock('../../../utils/Insights');

declare const insights;

describe('src/components/Beta', () => {

    const mockBeta = (isBeta: boolean) => {
        insights.chrome.isBeta.mockImplementation(() => isBeta);
    };

    beforeAll(() => {
        insights.chrome.isBeta.mockImplementation(() => {
            throw new Error('Specify the beta status for this test by running mockBeta');
            return false;
        });
    });

    it('BetaIf renders in beta', () => {
        mockBeta(true);
        render(
            <BetaDetector>
                <BetaIf>
                    <div>hello</div>
                </BetaIf>
            </BetaDetector>
        );
        expect(screen.queryByText('hello')).toBeTruthy();
    });

    it('BetaIf does not render in non-beta', () => {
        mockBeta(false);
        render(
            <BetaDetector>
                <BetaIf>
                    <div>hello</div>
                </BetaIf>
            </BetaDetector>
        );
        expect(screen.queryByText('hello')).toBeFalsy();
    });

    it('BetaIfNot does not render in beta', () => {
        mockBeta(true);
        render(
            <BetaDetector>
                <BetaIfNot>
                    <div>hello</div>
                </BetaIfNot>
            </BetaDetector>
        );
        expect(screen.queryByText('hello')).toBeFalsy();
    });

    it('BetaIfNot renders in non-beta', () => {
        mockBeta(false);
        render(
            <BetaDetector>
                <BetaIfNot>
                    <div>hello</div>
                </BetaIfNot>
            </BetaDetector>
        );
        expect(screen.queryByText('hello')).toBeTruthy();
    });

    it('Mixing BetaIf and BetaIfNot', () => {
        mockBeta(true);
        render(
            <BetaDetector>
                <BetaIf>
                    <div>foo</div>
                </BetaIf>
                <BetaIfNot>
                    <div>hello</div>
                </BetaIfNot>
            </BetaDetector>
        );
        expect(screen.queryByText('foo')).toBeTruthy();
        expect(screen.queryByText('hello')).toBeFalsy();
    });

    it('Duplicating throws an error', () => {
        const error = jest.spyOn(console, 'error');
        error.mockImplementation(() => '');
        mockBeta(true);

        expect(() => {
            render(
                <BetaDetector>
                    <BetaIf>
                        <div>foo</div>
                    </BetaIf>
                    <BetaIf>
                        <div>hello</div>
                    </BetaIf>
                </BetaDetector>
            );
        }).toThrowError('Only one of each BetaIf and BetaIfNot is allowed on each BetaDetector');
        error.mockRestore();
    });

    it('Other similar tags throw error', () => {
        const error = jest.spyOn(console, 'error');
        error.mockImplementation(() => '');
        mockBeta(true);

        expect(() => {
            render(
                <BetaDetector>
                    <div>hello</div>
                </BetaDetector>
            );
        }).toThrowError('Only BetaIf and BetaIfNot are accepted Elements in BetaDecorator');
        error.mockRestore();
    });
});
