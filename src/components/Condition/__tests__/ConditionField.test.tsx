import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { Schemas } from '../../../generated/Openapi';
import { Fact } from '../../../types/Fact';
import { buildOptionList, ConditionField, ConditionFieldProps } from '../ConditionField';
import FactType = Schemas.FactType;
import { waitForAsyncEvents } from '../../../../test/TestUtils';

describe('src/components/Condition/ConditionVisitor', () => {

    const testFacts: Fact[] = [
        {
            id: 1,
            name: 'foo.fact',
            type: FactType.Enum.STRING
        },
        {
            id: 2,
            name: 'bar.fact',
            type: FactType.Enum.STRING
        },
        {
            id: 3,
            name: 'baz',
            type: FactType.Enum.STRING
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

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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

        await userEvent.click(screen.getByLabelText('Options menu'));

        expect(screen.getByText('foo.fact')).toBeInTheDocument();
        expect(screen.getByText('bar.fact')).toBeInTheDocument();
        expect(screen.getByText('baz')).toBeInTheDocument();
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

        await userEvent.click(screen.getByLabelText(/Options menu/i));

        expect(screen.getByText('foo.fact')).toBeInTheDocument();
        expect(screen.queryByText('bar.fact')).not.toBeInTheDocument();
        expect(screen.queryByText('baz')).not.toBeInTheDocument();
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

        await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
        expect(screen.getByText('foo.fact')).toBeInTheDocument();
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

        await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
        expect(screen.getByText('foo.fact')).toBeInTheDocument();
        expect(screen.getByText('bar.fact')).toBeInTheDocument();
        expect(screen.queryByText('baz')).not.toBeInTheDocument();
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

        await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
        await userEvent.click(screen.getByText(/foo.fact/));
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

        await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
        await userEvent.click(screen.getByText(/foo.fact/));
        expect((screen.getByLabelText('Condition writer') as HTMLInputElement).value).toEqual('foo.fact');
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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
        await userEvent.type(screen.getByLabelText('Condition writer'), 'fact');
        await userEvent.click(screen.getByLabelText('Clear all'));
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

        await userEvent.type(screen.getByLabelText('Condition writer'), 'asdsagfdgdfsgad asdf as sdf sa fsd');
        await userEvent.click(screen.getByLabelText('Clear all'));
        expect(onSelect).toHaveBeenCalledWith('');
        expect(screen.getByText('foo.fact')).toBeInTheDocument();
        expect(screen.getByText('bar.fact')).toBeInTheDocument();
        expect(screen.getByText('baz')).toBeInTheDocument();
    });

    it('allows to write facts.arch = "x86_64" without having to copy/paste', async() => {
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

        await userEvent.type(screen.getByLabelText('Condition writer'), 'facts.arch = "x86_64"');
        await waitForAsyncEvents();

        expect(screen.getByDisplayValue('facts.arch = "x86_64"')).toBeInTheDocument();
    });

    describe('buildOptionList', () => {
        it('Yields empty if there is no match', () => {
            const options = buildOptionList('may', testFacts);
            expect(options).toEqual([]);
        });
    });
});
