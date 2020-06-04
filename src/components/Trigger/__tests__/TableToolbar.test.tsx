import * as React from 'react';
import { render } from '@testing-library/react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { TriggerTableToolbar } from '../TableToolbar';
import { Page } from '../../../types/Page';
import { TriggerFilterColumn } from '../../../pages/PolicyDetail/hooks/useTriggerFilter';
import { PaginationVariant } from '@patternfly/react-core';
import { ExporterType } from '../../../utils/exporters/Type';

jest.mock('@redhat-cloud-services/frontend-components');

describe('src/components/Trigger/TableToolbar', () => {

    const mockPrimaryToolbar = () => {
        const mockedControl = {
            props: undefined
        };
        (PrimaryToolbar as jest.Mock).mockImplementation(props => {
            mockedControl.props = props;
        });

        return mockedControl as any;
    };

    beforeEach(() => {
        (PrimaryToolbar as jest.Mock).mockReset();
    });

    const filterMocks = ({ system } = { system: '' }) => ({
        [TriggerFilterColumn.SYSTEM]: system || ''
    });

    const setFilterMocks = () => ({
        [TriggerFilterColumn.SYSTEM]: jest.fn()
    });

    it('Passes pagination props to the PrimaryToolbar', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks() }
            setFilters={ setFilterMocks() }
            clearFilters={ jest.fn() }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        expect(control.props.pagination).toEqual({
            itemCount: 1337,
            page: 33,
            perPage: 10,
            perPageOptions: [],
            onSetPage: paginationChanged,
            onFirstClick: paginationChanged,
            onPreviousClick: paginationChanged,
            onNextClick: paginationChanged,
            onLastClick: paginationChanged,
            onPageInput: paginationChanged,
            isCompact: true,
            variant: PaginationVariant.right
        });
    });

    it('Passes filterConfig props to the PrimaryToolbar', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const setFilterMocksValues = setFilterMocks();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks({
                system: 'foo-bar'
            }) }
            setFilters={ setFilterMocksValues }
            clearFilters={ jest.fn() }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        const onChangeMockFn = jest.fn();
        const onChangeOriginal = control.props.filterConfig.items[0].filterValues.onChange;
        control.props.filterConfig.items[0].filterValues.onChange = onChangeMockFn;

        expect(control.props.filterConfig).toEqual({
            items: [
                {
                    label: 'System',
                    type: 'text',
                    filterValues: {
                        id: 'filter-system',
                        value: 'foo-bar',
                        placeholder: 'Filter by system',
                        onChange: onChangeMockFn
                    }
                }
            ]
        });

        onChangeOriginal(undefined, 'my value');
        expect(setFilterMocksValues[TriggerFilterColumn.SYSTEM]).toHaveBeenCalledWith('my value');
    });

    it('Passes activeFiltersConfig props to the PrimaryToolbar with filter', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const setFilterMocksValues = setFilterMocks();
        const clearFn = jest.fn();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks({
                system: 'foo-bar'
            }) }
            setFilters={ setFilterMocksValues }
            clearFilters={ clearFn }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        const onDeleteMockFn = jest.fn();
        const onDeleteOriginal = control.props.activeFiltersConfig.onDelete;
        control.props.activeFiltersConfig.onDelete = onDeleteMockFn;

        expect(control.props.activeFiltersConfig).toEqual({
            filters: [
                {
                    category: 'System',
                    chips: [
                        {
                            name: 'foo-bar',
                            isRead: true
                        }
                    ]
                }
            ],
            onDelete: onDeleteMockFn
        });

        onDeleteOriginal(undefined, [
            {
                category: 'System'
            }
        ]);
        expect(clearFn).toHaveBeenCalledWith([ TriggerFilterColumn.SYSTEM ]);
    });

    it('activeFiltersConfig.onDelete throws with a invalid filter', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const setFilterMocksValues = setFilterMocks();
        const clearFn = jest.fn();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks({
                system: 'foo-bar'
            }) }
            setFilters={ setFilterMocksValues }
            clearFilters={ clearFn }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        const onDeleteOriginal = control.props.activeFiltersConfig.onDelete;

        expect(() => {
            onDeleteOriginal(undefined, [
                {
                    category: 'Wrong'
                }
            ]);
        }).toThrowError(/Unknown filter found/i)
        expect(clearFn).not.toHaveBeenCalled();
    });

    it('Passes activeFiltersConfig props to the PrimaryToolbar with no filter', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const setFilterMocksValues = setFilterMocks();
        const clearFn = jest.fn();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks() }
            setFilters={ setFilterMocksValues }
            clearFilters={ clearFn }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        const onDeleteMockFn = jest.fn();
        control.props.activeFiltersConfig.onDelete = onDeleteMockFn;

        expect(control.props.activeFiltersConfig).toEqual({
            filters: [ ],
            onDelete: onDeleteMockFn
        });
    });

    it('Passes exportConfig props to the PrimaryToolbar', () => {
        const control = mockPrimaryToolbar();
        const onExport = jest.fn();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks() }
            setFilters={ setFilterMocks() }
            clearFilters={ jest.fn() }
            onExport={ onExport }
            count={ 1337 }
            onPaginationChanged={ jest.fn() }
            pageCount={ 1 }
        />);

        const onSelectMockFn = jest.fn();
        const onSelectOriginal = control.props.exportConfig.onSelect;
        control.props.exportConfig.onSelect = onSelectMockFn;

        expect(control.props.exportConfig).toEqual({
            extraItems: [ ],
            onSelect: onSelectMockFn
        });

        onSelectOriginal(undefined, 'json');
        expect(onExport).toHaveBeenCalledWith(ExporterType.JSON);
    });
});
