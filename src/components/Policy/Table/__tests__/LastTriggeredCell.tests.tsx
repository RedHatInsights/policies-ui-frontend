import * as React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';

import { LastTriggeredCell } from '../LastTriggeredCell';

describe('src/components/Policy/Table/LastTriggeredCell', () => {

    const now = new Date(2020, 0, 1).getTime();

    beforeAll(() => {
        jest.spyOn(Date, 'now').mockImplementation(() => now);
    });

    it('renders does not fail when isEnabled is false', () => {
        const element = render(<LastTriggeredCell isEnabled={ false } lastEvaluation={ undefined }/>);
        expect(element).toBeTruthy();
    });

    it('lastEvaluation is set to never when undefined', () => {
        const element = render(<LastTriggeredCell isEnabled={ true } lastEvaluation={ undefined }/>);
        expect(element.getByText('Never')).toBeTruthy();
    });

    it('lastEvaluation is set to relative when less than 1 month ago', () => {
        const element = render(<LastTriggeredCell isEnabled={ true } lastEvaluation={ new Date(2020, 0, 21) }/>);
        expect(element.getByText('20 days ago')).toBeTruthy();
    });

    it('lastEvaluation is set to absolute when over 1 month ago', () => {
        const element = render(<LastTriggeredCell isEnabled={ true } lastEvaluation={ new Date(2019, 0, 21) }/>);
        expect(element.getByText('Jan 21 2019')).toBeTruthy();
    });
});
