import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import * as React from 'react';

import { DetailsStep } from '../DetailsStep';

const FormikMockContainer: React.FunctionComponent = (props) => (
    <Formik initialValues={ [] } onSubmit={ jest.fn() }>
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

        const input = document.getElementById('name') as HTMLInputElement;

        await act(async () => {
            await userEvent.type(input, lotsOfCharacters);
        });

        expect(input.value).toBe(lotsOfCharacters);
    });

    it('Name allows below 150 characters', async () => {
        render(
            <FormikMockContainer>
                <DetailsStep />
            </FormikMockContainer>
        );

        const lessCharacters = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula';

        expect(lessCharacters.length).toBeLessThan(150);

        const input = document.getElementById('name') as HTMLInputElement;

        await act(async () => {
            await userEvent.type(input, lessCharacters);
        });

        expect(input.value).toBe(lessCharacters);
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

        const input = document.getElementById('name') as HTMLInputElement;

        await act(async () => {
            await userEvent.type(input, aLotMoreOfCharacters);
        });

        expect(input.value.length).toBe(150);
        expect(input.value).toBe(aLotMoreOfCharacters.slice(0, 150));
    });
});
