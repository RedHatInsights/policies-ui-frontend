import { arrayValue, Filter, Operator, Page, Sort, stringValue } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { PolicyFilterColumn, PolicyFilters } from '../types/Policy/Filters';

export interface UsePolicyPageReturn {
    page: Page;
    // Todo: prevent the event from reaching this point
    changePage: (event: any, page: number) => void;
    changeItemsPerPage: (event: any, perPage: number) => void;
}

export const usePolicyPage = (filters: PolicyFilters, defaultPerPage: number, sort?: Sort): UsePolicyPageReturn => {

    const [ currentPage, setCurrentPage ] = React.useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(defaultPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [ setCurrentPage, filters ]);

    const page = React.useMemo(() => {
        const filter = new Filter();

        const name = stringValue(filters[PolicyFilterColumn.NAME]).trim();
        const isActive = arrayValue(filters[PolicyFilterColumn.IS_ACTIVE]);

        if (name !== '') {
            filter.and(PolicyFilterColumn.NAME, Operator.ILIKE, `%${name}%`);
        }

        if (isActive.length === 1) {
            filter.and(
                PolicyFilterColumn.IS_ACTIVE,
                Operator.BOOLEAN_IS,
                isActive.includes('Enabled') ? 'true' : 'false');
        }

        const overrideSort = sort ? Sort.by(
            sort.column === 'is_enabled' ? 'lastTriggered' : sort.column,
            sort.direction
        ) : undefined;

        return Page.of(currentPage, itemsPerPage, filter, overrideSort);
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
        changePage,
        changeItemsPerPage
    };
};
