import * as React from 'react';
import { render } from '@testing-library/react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { TriggerTableToolbar } from '../TableToolbar';
import { Page, ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { PaginationVariant } from '@patternfly/react-core';
import { TriggerFilterColumn } from '../Filters';

jest.mock('@redhat-cloud-services/frontend-components');

describe('src/components/Trigger/TableToolbar', () => {

    const mockPrimaryToolbar = () => {
        const mockedControl = {
            topProps: undefined,
            bottomProps: undefined
        };
        (PrimaryToolbar as jest.Mock).mockImplementation(props => {
            if (mockedControl.topProps === undefined) {
                mockedControl.topProps = props;
            } else if (mockedControl.bottomProps === undefined) {
                mockedControl.bottomProps = props;
            }
        });

        return mockedControl as any;
    };

    type FilterMock = {
        name?: string;
        id?: string;
    }

    const filterMocks = ({ name, id }: FilterMock = { name: '', id: '' }) => ({
        [TriggerFilterColumn.NAME]: name ?? '',
        [TriggerFilterColumn.ID]: id ?? ''
    });

    const setFilterMocks = () => ({
        [TriggerFilterColumn.NAME]: jest.fn(),
        [TriggerFilterColumn.ID]: jest.fn()
    });

    beforeEach(() => {
        (PrimaryToolbar as jest.Mock).mockReset();
    });

    it('Passes pagination props to the PrimaryToolbar', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const paginationSizeChanged = jest.fn();
        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            onExport={ jest.fn() }
            count={ 1337 }
            filters={ filterMocks() }
            setFilters={ setFilterMocks() }
            clearFilters={ jest.fn() }
            onPaginationChanged={ paginationChanged }
            onPaginationSizeChanged={ paginationSizeChanged }
            pageCount={ 1 }
        />);

        expect(control.topProps.pagination).toEqual({
            itemCount: 1337,
            page: 33,
            perPage: 10,
            perPageOptions: undefined,
            onSetPage: paginationChanged,
            onFirstClick: paginationChanged,
            onPreviousClick: paginationChanged,
            onNextClick: paginationChanged,
            onLastClick: paginationChanged,
            onPageInput: paginationChanged,
            onPerPageSelect: paginationSizeChanged,
            isCompact: true,
            variant: PaginationVariant.top
        });

        expect(control.bottomProps.pagination).toEqual({
            itemCount: 1337,
            page: 33,
            perPage: 10,
            perPageOptions: undefined,
            onSetPage: paginationChanged,
            onFirstClick: paginationChanged,
            onPreviousClick: paginationChanged,
            onNextClick: paginationChanged,
            onLastClick: paginationChanged,
            onPageInput: paginationChanged,
            onPerPageSelect: paginationSizeChanged,
            isCompact: false,
            variant: PaginationVariant.bottom
        });
    });

    it('Passes filterConfig props to the PrimaryToolbar', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const setFilterMocksValues = setFilterMocks();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks({
                name: 'foo-bar'
            }) }
            setFilters={ setFilterMocksValues }
            clearFilters={ jest.fn() }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        const onChangeMockFn = jest.fn();
        const onChangeOriginal = control.topProps.filterConfig.items[0].filterValues.onChange;
        control.topProps.filterConfig.items[0].filterValues.onChange = onChangeMockFn;
        control.topProps.filterConfig.items[1].filterValues.onChange = onChangeMockFn;

        expect(control.topProps.filterConfig).toEqual({
            items: [
                {
                    label: 'Name',
                    type: 'text',
                    filterValues: {
                        id: 'filter-name',
                        value: 'foo-bar',
                        placeholder: 'Filter by System name',
                        onChange: onChangeMockFn
                    }
                },
                {
                    label: 'Id',
                    type: 'text',
                    filterValues: {
                        id: 'filter-id',
                        value: '',
                        placeholder: 'Filter by System id',
                        onChange: onChangeMockFn
                    }
                }
            ]
        });

        onChangeOriginal(undefined, 'my value');
        expect(setFilterMocksValues[TriggerFilterColumn.NAME]).toHaveBeenCalledWith('my value');
    });

    it('Passes activeFiltersConfig props to the PrimaryToolbar with filter', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const setFilterMocksValues = setFilterMocks();
        const clearFn = jest.fn();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks({
                name: 'foo-bar'
            }) }
            setFilters={ setFilterMocksValues }
            clearFilters={ clearFn }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        const onDeleteMockFn = jest.fn();
        const onDeleteOriginal = control.topProps.activeFiltersConfig.onDelete;
        control.topProps.activeFiltersConfig.onDelete = onDeleteMockFn;

        expect(control.topProps.activeFiltersConfig).toEqual({
            filters: [
                {
                    category: 'Name',
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
                category: 'Name'
            }
        ]);
        expect(clearFn).toHaveBeenCalledWith([ TriggerFilterColumn.NAME ]);
    });

    it('activeFiltersConfig.onDelete throws with a invalid filter', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        const setFilterMocksValues = setFilterMocks();
        const clearFn = jest.fn();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            filters={ filterMocks({
                name: 'foo-bar'
            }) }
            setFilters={ setFilterMocksValues }
            clearFilters={ clearFn }
            onExport={ jest.fn() }
            count={ 1337 }
            onPaginationChanged={ paginationChanged }
            pageCount={ 1 }
        />);

        const onDeleteOriginal = control.topProps.activeFiltersConfig.onDelete;

        expect(() => {
            onDeleteOriginal(undefined, [
                {
                    category: 'Wrong'
                }
            ]);
        }).toThrowError(/Unexpected filter column label found: Wrong/i);
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
        control.topProps.activeFiltersConfig.onDelete = onDeleteMockFn;

        expect(control.topProps.activeFiltersConfig).toEqual({
            filters: [ ],
            onDelete: onDeleteMockFn
        });
    });

    it('Passes exportConfig props to the PrimaryToolbar', () => {
        const control = mockPrimaryToolbar();
        const onExport = jest.fn();

        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
            onExport={ onExport }
            count={ 1337 }
            onPaginationChanged={ jest.fn() }
            filters={ filterMocks() }
            setFilters={ setFilterMocks() }
            clearFilters={ jest.fn() }
            pageCount={ 1 }
        />);

        const onSelectMockFn = jest.fn();
        const onSelectOriginal = control.topProps.exportConfig.onSelect;
        control.topProps.exportConfig.onSelect = onSelectMockFn;

        expect(control.topProps.exportConfig).toEqual({
            extraItems: [ ],
            onSelect: onSelectMockFn,
            'data-testid': 'trigger-toolbar-export-container'
        });

        onSelectOriginal(undefined, 'json');
        expect(onExport).toHaveBeenCalledWith(ExporterType.JSON);
    });
});
