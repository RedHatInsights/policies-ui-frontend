import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { LastTriggeredCell } from '../LastTriggeredCell';

describe('src/components/Policy/Table/LastTriggeredCell', () => {

    const now = new Date(2020, 0, 1).getTime();

    beforeAll(() => {
        jest.spyOn(Date, 'now').mockImplementation(() => now);
    });

    it('renders does not fail when isEnabled is false', () => {
        const view = render(<LastTriggeredCell isEnabled={ false } lastTriggered={ undefined } />);
        expect(view).toBeTruthy();
    });

    it('lastTriggered is set to never when undefined', () => {
        render(<LastTriggeredCell isEnabled={ true } lastTriggered={ undefined } />);
        expect(screen.getByText('Never')).toBeInTheDocument();
    });

    it('lastTriggered is set to relative when less than 1 month ago', () => {
        render(<LastTriggeredCell isEnabled={ true } lastTriggered={ new Date(2020, 0, 21) } />);
        expect(screen.getByText('20 days ago')).toBeInTheDocument();
    });

    it('lastTriggered is set to absolute when over 1 month ago', () => {
        render(<LastTriggeredCell isEnabled={ true } lastTriggered={ new Date(2019, 0, 21) } />);
        expect(screen.getByText('Jan 21 2019')).toBeInTheDocument();
    });
});
