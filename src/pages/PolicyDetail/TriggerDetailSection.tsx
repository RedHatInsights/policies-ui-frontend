// @ts-nocheck
import { Section } from '@redhat-cloud-services/frontend-components';
import {
    Direction,
    ExporterType,
    exporterTypeFromString, Sort, useSort,
    UseSortReturn } from '@redhat-cloud-services/insights-common-typescript';
import { format } from 'date-fns';
import inBrowserDownload from 'in-browser-download';
import * as React from 'react';
import { forwardRef, useCallback } from 'react';

import { TriggerTable } from '../../components/Trigger/Table';
import { TriggerTableEmptyState } from '../../components/Trigger/Table/EmptyState';
import { TriggerTableToolbar } from '../../components/Trigger/TableToolbar';
import Config from '../../config/Config';
import { PagedTrigger } from '../../types/Trigger';
import { triggerExporterFactory } from '../../utils/exporters/Trigger/Factory';
import { useGetAllTriggers } from './hooks/useGetAllTriggers';
import { useGetPolicyDetailTriggerHistory } from './hooks/useGetPolicyDetailTriggerHistory';
import { useTriggerFilter } from './hooks/useTriggerFilter';
import { useTriggerPage } from './hooks/useTriggerPage';
import { PolicyDetailTriggerEmptyState } from './TriggerEmptyState';
import { TriggerErrorState } from './TriggerErrorState';

const defaultSort = Sort.by('ctime', Direction.DESCENDING);

interface TriggerDetailSectionProps {
    policyId: string;
}

export interface TriggerDetailAPI {
    refresh: () => void;
}

interface TableContent {
    errorContent?: React.ReactNode;
    payload?: PagedTrigger;
    loading: boolean;
    sort: UseSortReturn;
}

const TableContent: React.FunctionComponent<TableContent> = (props) => {

    if (props.errorContent) {
        return <> { props.errorContent } </>;
    }

    if ((props.payload && props.payload.count > 0) || props.loading) {
        return (
            <TriggerTable
                rows={ props.payload?.data }
                onSort={ props.sort.onSort }
                sortBy={ props.sort.sortBy }
                loading={ props.loading }
            />
        );
    }

    return <TriggerTableEmptyState />;
};

const TriggerDetailSectionInternal: React.ForwardRefRenderFunction<TriggerDetailAPI, TriggerDetailSectionProps> = (props, ref) => {

    const { policyId } = props;
    const triggerFilter = useTriggerFilter();
    const getTriggers = useGetPolicyDetailTriggerHistory();

    const pagedTriggers = React.useMemo(() => {
        const payload = getTriggers.payload;
        if (payload?.type === 'PagedTriggers') {
            return payload.value;
        }

        return undefined;
    }, [ getTriggers.payload ]);

    const [ triggersPerPage, setTriggersPerPage ] = React.useState<number>(Config.defaultElementsPerPage);
    const sort = useSort(defaultSort);
    const {
        page,
        onPaginationChanged
    } = useTriggerPage(triggersPerPage, sort.sortBy, triggerFilter.debouncedFilters);

    const refresh = useCallback(() => {
        const query = getTriggers.query;
        if (policyId) {
            query({
                policyId,
                page
            });
        }
    }, [ policyId, getTriggers.query, page ]);

    React.useEffect(() => {
        refresh();
    }, [ refresh ]);

    React.useImperativeHandle(ref, () => ({
        refresh
    }), [ refresh ]);

    const getAllTriggers = useGetAllTriggers(policyId, page.filter);

    const onExport = React.useCallback((type: ExporterType) => {
        const exporter = triggerExporterFactory(exporterTypeFromString(type));
        getAllTriggers().then(triggers => {
            if (triggers.length > 0) {
                inBrowserDownload(
                    exporter.export(triggers),
                    `policy-${policyId}-triggers-${format(new Date(Date.now()), 'y-dd-MM')}.${exporter.type}`
                );
            }
        });
    }, [ getAllTriggers, policyId ]);

    const onChangeTriggersPerPage = React.useCallback((_events, perPage: number) => {
        setTriggersPerPage(perPage);
    }, [ setTriggersPerPage ]);

    let triggerErrorState;
    if (!getTriggers.loading && getTriggers.error && getTriggers.status !== 404) {
        triggerErrorState = <TriggerErrorState action={ refresh } error={ `code: ${getTriggers.status}` } />;
    }

    return (
        <Section>
            { getTriggers.hasTriggers === false ? (
                <PolicyDetailTriggerEmptyState />
            ) : (
                <>
                    <TriggerTableToolbar
                        count={ pagedTriggers?.count }
                        page={ page }
                        onPaginationChanged={ onPaginationChanged }
                        onPaginationSizeChanged={ onChangeTriggersPerPage }
                        pageCount={ pagedTriggers?.data?.length }
                        filters={ triggerFilter.filters }
                        setFilters={ triggerFilter.setFilters }
                        clearFilters={ triggerFilter.clearFilter }
                        onExport={ onExport }
                    >
                        <TableContent
                            loading={ getTriggers.loading }
                            payload={ pagedTriggers }
                            sort={ sort }
                            errorContent={ triggerErrorState }
                        />
                    </TriggerTableToolbar>
                </>
            )}
        </Section>
    );
};

export const TriggerDetailSection = forwardRef<TriggerDetailAPI, TriggerDetailSectionProps>(TriggerDetailSectionInternal);
