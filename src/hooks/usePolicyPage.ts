import * as React from 'react';
import { Filter, Operator, Page, Sort } from '../types/Page';
import { PolicyFilterColumn, PolicyFilters } from '../types/Policy/PolicyPaging';

interface UsePolicyPageReturn {
    page: Page;
    itemsPerPage: number;
    currentPage: number;
    // Todo: prevent the event from reaching this point
    changePage: (event: any, page: number) => void;
    changeItemsPerPage: (event: any, perPage: number) => void;
}

export const usePolicyPage = (filters: PolicyFilters, defaultPerPage?: number, sort?: Sort): UsePolicyPageReturn => {

    const [ currentPage, setCurrentPage ] = React.useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(defaultPerPage || Page.defaultPage().size);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [ setCurrentPage, filters ]);

    const page = React.useMemo(() => {
        const filter = new Filter();

        if (filters[PolicyFilterColumn.NAME].trim() !== '') {
            filter.and(PolicyFilterColumn.NAME, Operator.ILIKE, `%${filters[PolicyFilterColumn.NAME].trim()}%`);
        }

        if (filters[PolicyFilterColumn.IS_ACTIVE].disabled !== filters[PolicyFilterColumn.IS_ACTIVE].enabled) {
            filter.and(
                PolicyFilterColumn.IS_ACTIVE,
                Operator.BOOLEAN_IS,
                filters[PolicyFilterColumn.IS_ACTIVE].enabled ? 'true' : 'false');
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
