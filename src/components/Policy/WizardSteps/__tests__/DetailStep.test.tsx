import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import * as React from 'react';

import { DetailsStep } from '../DetailsStep';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';

const FormikMockContainer: React.FunctionComponent = (props) => (
    <Formik initialValues={ [] } onSubmit={ jest.fn() }>
        {/* eslint-disable-next-line testing-library/no-node-access */}
        { props.children }
    </Formik>
);

describe('src/components/Policy/WizardSteps/DetailStep', () => {
    it('Name allows 150 characters', async () => {
        render(
            <FormikMockContainer>
                <DetailsStep />
            </FormikMockContainer>
        );

        const lotsOfCharacters = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula ' +
            'get dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis pa';

        expect(lotsOfCharacters.length).toBe(150);

        const input = screen.getByLabelText(/name/i);
        userEvent.type(input, lotsOfCharacters);
        await waitForAsyncEvents();

        expect(input).toHaveValue(lotsOfCharacters);
    });

    it('Name allows below 150 characters', async () => {
        render(
            <FormikMockContainer>
                <DetailsStep />
            </FormikMockContainer>
        );

        const lessCharacters = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula';

        expect(lessCharacters.length).toBeLessThan(150);

        const input = screen.getByLabelText(/name/i);
        userEvent.type(input, lessCharacters);
        await waitForAsyncEvents();

        expect(input).toHaveValue(lessCharacters);
    });

    it('Name prevents above 150 characters', async () => {
        render(
            <FormikMockContainer>
                <DetailsStep />
            </FormikMockContainer>
        );

        const aLotMoreOfCharacters = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula ' +
            'get dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis pa and bla bla bla bla bla bla';

        expect(aLotMoreOfCharacters.length).toBeGreaterThan(150);

        const input = screen.getByLabelText(/name/i);
        userEvent.type(input, aLotMoreOfCharacters);
        await waitForAsyncEvents();

        expect(input).toHaveValue('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula get dolor. ' +
            'Aenean massa. Cum sociis natoque penatibus et magnis dis pa');
    });
});
