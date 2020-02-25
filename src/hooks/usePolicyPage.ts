import * as React from 'react';
import { Filter, Operator, Page, Sort } from '../types/Page';
import { FilterColumn, Filters } from '../components/Policy/TableToolbar/PolicyTableToolbar';

export const usePolicyPage = (filters: Filters, sort: Sort | undefined) => {

    const [ currentPage, setCurrentPage ] = React.useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(Page.defaultPage().size);

    const page = React.useMemo(() => {
        const filter = new Filter();

        if (filters[FilterColumn.NAME].trim() !== '') {
            filter.and(FilterColumn.NAME, Operator.ILIKE, `%${filters[FilterColumn.NAME].trim()}%`);
        }

        if (filters[FilterColumn.DESCRIPTION].trim() !== '') {
            filter.and(FilterColumn.DESCRIPTION, Operator.ILIKE, `%${filters[FilterColumn.DESCRIPTION].trim()}%`);
        }

        if (filters[FilterColumn.IS_ACTIVE].disabled !== filters[FilterColumn.IS_ACTIVE].enabled) {
            filter.and(
                FilterColumn.IS_ACTIVE,
                Operator.BOOLEAN_IS,
                filters[FilterColumn.IS_ACTIVE].enabled ? 'true' : 'false');
        }

        return Page.of(currentPage, itemsPerPage, filter, sort);
    }, [ currentPage, itemsPerPage, sort, filters ]);

    const changePage = React.useCallback((event, page: number) => {
        setCurrentPage(page);
    }, [ setCurrentPage ]);

    const changeItemsPerPage = React.useCallback((event, perPage: number) => {
        setCurrentPage(1);
        setItemsPerPage(perPage);
    }, [ setCurrentPage, setItemsPerPage ]);

    return {
        page,
        itemsPerPage,
        currentPage,
        changePage,
        changeItemsPerPage
    };
};
