import * as React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { buildOptionList, ConditionField, ConditionFieldProps, factToOptions } from '../ConditionField';
import { Fact } from '../../../types/Fact';
import { FactType } from '../../../types/GeneratedOpenApi';

describe('src/components/Condition/ConditionVisitor', () => {

    const testFacts: Fact[] = [
        {
            id: 1,
            name: 'foo.fact',
            type: FactType.STRING
        },
        {
            id: 2,
            name: 'bar.fact',
            type: FactType.STRING
        },
        {
            id: 3,
            name: 'baz',
            type: FactType.STRING
        }
    ];

    const ConditionFieldContainer: React.FunctionComponent<ConditionFieldProps> = (props) => {
        const [ value, setValue ] = React.useState<string>(props.value);

        const onSelect = React.useCallback((arg) => {
            const propsOnSelect = props.onSelect;
            propsOnSelect(arg);
            setValue(arg);
        }, [ props.onSelect, setValue ]);

        return <ConditionField
            { ...props }
            value={ value }
            onSelect={ onSelect }
        />;
    };

    it('shows closed by default', async () => {
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        expect(screen.queryByRole('listbox')).toBeFalsy();
    });

    it('shows the facts when clicking the toggle', async () => {
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText('Options menu'));
        });

        expect(screen.getByText('foo.fact')).toBeTruthy();
        expect(screen.getByText('bar.fact')).toBeTruthy();
        expect(screen.getByText('baz')).toBeTruthy();
    });

    it('should filter from initial value', async () => {
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ 'foo' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.click(screen.getByLabelText('Options menu'));
        });

        expect(screen.getByText('foo.fact')).toBeTruthy();
        expect(screen.queryByText('bar.fact')).toBeFalsy();
        expect(screen.queryByText('baz')).toBeFalsy();
    });

    it('Should appear when we got a fact match', async () => {
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
        });
        expect(screen.getByText('foo.fact')).toBeTruthy();
    });

    it('Should show all matches', async () => {
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
        });
        expect(screen.getByText('foo.fact')).toBeTruthy();
        expect(screen.getByText('bar.fact')).toBeTruthy();
        expect(screen.queryByText('baz')).toBeFalsy();
    });

    it('Sets selection when clicking over an option', async () => {
        const onSelect = jest.fn();
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ onSelect }
            />
        );

        await act(async () => {
            await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
            userEvent.click(screen.getByText(/foo.fact/));
        });

        expect(onSelect).toHaveBeenCalledWith('foo.fact');
    });

    it('closes list when selecting an element', async () => {
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ jest.fn() }
            />
        );

        await act(async () => {
            await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
            await userEvent.click(screen.getByText(/foo.fact/));
        });

        expect((screen.getByLabelText('Condition writer') as HTMLInputElement).value).toEqual('foo.fact');
        expect(screen.queryByRole('listbox')).toBeFalsy();
    });

    it('clears selection when clicking the "clear all" button', async () => {
        const onSelect = jest.fn();
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ 'f' }
                onSelect={ onSelect }
            />
        );
        await act(async () => {
            await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
            await userEvent.click(screen.getByLabelText('Clear all'));
        });

        expect(onSelect).toHaveBeenCalledWith('');
    });

    it('typeahead does not break when having wrong input and clearing all', async () => {
        const onSelect = jest.fn();
        render(
            <ConditionFieldContainer
                label="my label"
                id="my-id"
                name="my name"
                facts={ testFacts }
                value={ '' }
                onSelect={ onSelect }
            />
        );
        await act(async () => {
            await userEvent.type(screen.getByLabelText('Condition writer'), 'asdsagfdgdfsgad asdf as sdf sa fsd');
            await userEvent.click(screen.getByLabelText('Clear all'));
        });

        expect(onSelect).toHaveBeenCalledWith('');
        expect(screen.getByText('foo.fact')).toBeTruthy();
        expect(screen.getByText('bar.fact')).toBeTruthy();
        expect(screen.getByText('baz')).toBeTruthy();
    });

    describe('buildOptionList', () => {
        it('Yields empty if there is no match', () => {
            const options = buildOptionList('may', testFacts);
            expect(options).toEqual([]);
        });
    });
});
