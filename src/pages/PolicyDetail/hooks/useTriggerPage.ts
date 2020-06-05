import * as React from 'react';
import { useEffect } from 'react';
import { Filter, Operator, Page, Sort } from '../../../types/Page';
import { TriggerFilterColumn, TriggerFilters } from './useTriggerFilter';

const elementsPerPage = 50;

export const useTriggerPage = (sort: Sort | undefined, filters: TriggerFilters) => {
    const [ page, setPage ] = React.useState<Page>(() => Page.of(1, elementsPerPage));

    const pageFilter = React.useMemo(() => {
        const pageFilter = new Filter();
        const system = filters[TriggerFilterColumn.SYSTEM];
        if (system && system.trim() !== '') {
            pageFilter.and('system', Operator.ILIKE, system.trim().toLowerCase());
        }

        return pageFilter;
    }, [ filters ]);

    useEffect(() => {
        setPage(oldPage => Page.of(oldPage.index, oldPage.size, oldPage.filter, sort));
    }, [ sort ]);

    useEffect(() => {
        setPage(oldPage => Page.of(1, oldPage.size, pageFilter, oldPage.sort));
    }, [ pageFilter ]);

    const onPaginationChanged = React.useCallback((_event, page: number) => {
        setPage(oldPage => oldPage.withPage(page));
    }, [ setPage ]);

    return {
        page,
        onPaginationChanged
    };
};
