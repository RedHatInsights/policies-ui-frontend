import * as React from 'react';
import { useEffect } from 'react';
import { Filter, Operator, Page, Sort } from '../../../types/Page';
import { TriggerFilterColumn, TriggerFilters } from './useTriggerFilter';

const elementsPerPage = 50;

export const useTriggerPage = (sort: Sort | undefined, filters: TriggerFilters) => {

    const pageFilter = React.useMemo(() => {
        const pageFilter = new Filter();
        const system = filters[TriggerFilterColumn.SYSTEM];
        if (system && system.trim() !== '') {
            pageFilter.and('system', Operator.ILIKE, system.trim().toLowerCase());
        }

        return pageFilter;
    }, [ filters ]);

    const [ page, setPage ] = React.useState<Page>(() => Page.of(1, elementsPerPage, pageFilter, sort));

    useEffect(() => {
        setPage(oldPage => {
            if (oldPage.sort !== sort) {
                return Page.of(oldPage.index, oldPage.size, oldPage.filter, sort);
            }

            return oldPage;
        });
    }, [ sort ]);

    useEffect(() => {
        setPage(oldPage => {
            if (oldPage.filter !== pageFilter) {
                return Page.of(1, oldPage.size, pageFilter, oldPage.sort);
            }

            return oldPage;
        });
    }, [ pageFilter ]);

    const onPaginationChanged = React.useCallback((_event, page: number) => {
        setPage(oldPage => oldPage.withPage(page));
    }, [ setPage ]);

    return {
        page,
        onPaginationChanged
    };
};
