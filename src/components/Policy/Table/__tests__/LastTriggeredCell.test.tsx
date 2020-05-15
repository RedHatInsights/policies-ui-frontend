import * as React from 'react';
import { render } from '@testing-library/react';

import { LastTriggeredCell } from '../LastTriggeredCell';

describe('src/components/Policy/Table/LastTriggeredCell', () => {

    const now = new Date(2020, 0, 1).getTime();

    beforeAll(() => {
        jest.spyOn(Date, 'now').mockImplementation(() => now);
    });

    it('renders does not fail when isEnabled is false', () => {
        const element = render(<LastTriggeredCell isEnabled={ false } lastTriggered={ undefined }/>);
        expect(element).toBeTruthy();
    });

    it('lastTriggered is set to never when undefined', () => {
        const element = render(<LastTriggeredCell isEnabled={ true } lastTriggered={ undefined }/>);
        expect(element.getByText('Never')).toBeTruthy();
    });

    it('lastTriggered is set to relative when less than 1 month ago', () => {
        const element = render(<LastTriggeredCell isEnabled={ true } lastTriggered={ new Date(2020, 0, 21) }/>);
        expect(element.getByText('20 days ago')).toBeTruthy();
    });

    it('lastTriggered is set to absolute when over 1 month ago', () => {
        const element = render(<LastTriggeredCell isEnabled={ true } lastTriggered={ new Date(2019, 0, 21) }/>);
        expect(element.getByText('Jan 21 2019')).toBeTruthy();
    });
});
