import * as React from 'react';
import { render } from '@testing-library/react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { TriggerTableToolbar } from '../TableToolbar';
import { Page } from '../../../types/Page';
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

    it('Passes pagination props to the PrimaryToolbar', () => {
        const control = mockPrimaryToolbar();
        const paginationChanged = jest.fn();
        render(<TriggerTableToolbar
            page={ Page.of(33, 10) }
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
            variant: PaginationVariant.top
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
            pageCount={ 1 }
        />);

        const onSelectMockFn = jest.fn();
        const onSelectOriginal = control.props.exportConfig.onSelect;
        control.props.exportConfig.onSelect = onSelectMockFn;

        expect(control.props.exportConfig).toEqual({
            extraItems: [ ],
            onSelect: onSelectMockFn,
            'data-testid': 'trigger-toolbar-export-container'
        });

        onSelectOriginal(undefined, 'json');
        expect(onExport).toHaveBeenCalledWith(ExporterType.JSON);
    });
});
