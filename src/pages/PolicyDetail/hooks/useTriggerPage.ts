import * as React from 'react';
import { useEffect } from 'react';
import { Filter, Operator, Page, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { TriggerFilterColumn, TriggerFilters } from './useTriggerFilter';

export const useTriggerPage = (elementsPerPage: number, sort: Sort | undefined, filters: TriggerFilters) => {

    const pageFilter = React.useMemo(() => {
        const pageFilter = new Filter();
        const name = filters[TriggerFilterColumn.NAME];
        const id = filters[TriggerFilterColumn.ID];
        if (name && name.trim() !== '') {
            pageFilter.and('name', Operator.LIKE, name.trim().toLowerCase());
        }

        if (id && id.trim() !== '') {
            pageFilter.and('id', Operator.EQUAL, id.trim().toLowerCase());
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

    useEffect(() => {
        setPage(oldPage => {
            if (oldPage.size !== elementsPerPage) {
                return Page.of(1, elementsPerPage, oldPage.filter, oldPage.sort);
            }

            return oldPage;
        });
    }, [ elementsPerPage ]);

    const onPaginationChanged = React.useCallback((_event, page: number) => {
        setPage(oldPage => oldPage.withPage(page));
    }, [ setPage ]);

    return {
        page,
        onPaginationChanged
    };
};
