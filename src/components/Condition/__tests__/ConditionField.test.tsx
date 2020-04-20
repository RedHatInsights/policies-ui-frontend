/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';
import { render, act, getByText, queryByText, queryByLabelText, queryByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConditionField } from '../ConditionField';
import { Fact } from '../../../types/Fact';
import { FactType } from '../../../types/GeneratedOpenApi';

describe('src/components/Condition/ConditionVisitor', () => {

    const testFacts: Fact[] = [
        {
            id: 1,
            name: 'foo fact',
            type: FactType.STRING
        },
        {
            id: 2,
            name: 'bar fact',
            type: FactType.STRING
        },
        {
            id: 3,
            name: 'baz',
            type: FactType.STRING
        }
    ];

    it('shows the facts when clicking the toggle', async () => {
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.click(queryByLabelText(result.container, 'Options menu')!);
        });

        expect(getByText(result.container, 'foo fact')).toBeTruthy();
        expect(getByText(result.container, 'bar fact')).toBeTruthy();
        expect(getByText(result.container, 'baz')).toBeTruthy();
    });

    it('should filter from initial value', async () => {
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ 'foo' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.click(queryByLabelText(result.container, 'Options menu')!);
        });

        expect(getByText(result.container, 'foo fact')).toBeTruthy();
        expect(queryByText(result.container, 'bar fact')).toBeFalsy();
        expect(queryByText(result.container, 'baz')).toBeFalsy();
    });

    it('Should appear when we got a fact match', async () => {
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.type(queryByLabelText(result.container, 'Condition writer')!, 'fact');
        });
        expect(getByText(result.container, 'foo fact')).toBeTruthy();
    });

    it('Should show all matches', async () => {
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.type(queryByLabelText(result.container, 'Condition writer')!, 'fact');
        });
        expect(getByText(result.container, 'foo fact')).toBeTruthy();
        expect(getByText(result.container, 'bar fact')).toBeTruthy();
        expect(queryByText(result.container, 'baz')).toBeFalsy();
    });

    it('Sets selection when clicking over an option', async () => {
        const onSelect = jest.fn();
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ onSelect }
            />
        );

        await act(async () => {
            await userEvent.type(queryByLabelText(result.container, 'Condition writer')!, 'fact');
            await userEvent.click(queryByText(result.container, /foo fact/)!);
        });

        expect(onSelect).toHaveBeenCalledWith('foo fact');
    });

    it('closes list when selecting an element', async () => {
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.type(queryByLabelText(result.container, 'Condition writer')!, 'fact');
            await userEvent.click(queryByText(result.container, /foo fact/)!);
        });

        expect(queryByRole(result.container, 'listbox')).toBeFalsy();
    });

    it('clears selection when clicking the "clear all" button', async () => {
        const onSelect = jest.fn();
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ 'f' }
                onSelect={ onSelect }
            />
        );
        await act(async () => {
            await userEvent.type(queryByLabelText(result.container, 'Condition writer')!, 'fact');
            await userEvent.click(queryByLabelText(result.container, 'Clear all')!);
        });

        expect(onSelect).toHaveBeenCalledWith('');
    });

    it('typeahead does not break when having wrong input and clearing all', async () => {
        const onSelect = jest.fn();
        const result = render(
            <ConditionField
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ onSelect }
            />
        );
        await act(async () => {
            await userEvent.type(queryByLabelText(result.container, 'Condition writer')!, 'asdsagfdgdfsgad asdf as sdf sa fsd');
            await userEvent.click(queryByLabelText(result.container, 'Clear all')!);
        });

        expect(onSelect).toHaveBeenCalledWith('');
        expect(getByText(result.container, 'foo fact')).toBeTruthy();
        expect(getByText(result.container, 'bar fact')).toBeTruthy();
        expect(getByText(result.container, 'baz')).toBeTruthy();
    });

});
