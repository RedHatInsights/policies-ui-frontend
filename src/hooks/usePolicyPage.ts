import * as React from 'react';
import { Filter, Operator, Page, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { PolicyFilterColumn, PolicyFilters } from '../types/Policy/Filters';
import * as webpack from 'webpack';
import asString = webpack.Template.asString;

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

        const name = asString(filters[PolicyFilterColumn.NAME] || '').trim();
        const isActive = asString(filters[PolicyFilterColumn.IS_ACTIVE] || '').trim();

        if (name !== '') {
            filter.and(PolicyFilterColumn.NAME, Operator.ILIKE, `%${name}%`);
        }

        if (isActive !== '') {
            filter.and(
                PolicyFilterColumn.IS_ACTIVE,
                Operator.BOOLEAN_IS,
                isActive === 'Enabled' ? 'true' : 'false');
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
        changePage,
        changeItemsPerPage
    };
};
