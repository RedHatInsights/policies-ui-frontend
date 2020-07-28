import * as React from 'react';
import inBrowserDownload from 'in-browser-download';
import { PolicyDetailTriggerEmptyState } from './TriggerEmptyState';
import { TriggerTableToolbar } from '../../components/Trigger/TableToolbar';
import { TriggerTable } from '../../components/Trigger/Table';
import { TriggerTableEmptyState } from '../../components/Trigger/Table/EmptyState';
import {
    Direction,
    ExporterType,
    exporterTypeFromString,
    Section, Sort, UsePolicySortReturn,
    useSort
} from '@redhat-cloud-services/insights-common-typescript';
import { triggerExporterFactory } from '../../utils/exporters/Trigger/Factory';
import { format } from 'date-fns';
import { useGetAllTriggers } from './hooks/useGetAllTriggers';
import { useTriggerPage } from './hooks/useTriggerPage';
import { useTriggerFilter } from './hooks/useTriggerFilter';
import { useGetPolicyDetailTriggerHistory } from './hooks/useGetPolicyDetailTriggerHistory';
import { forwardRef, useCallback } from 'react';
import { TriggerErrorState } from './TriggerErrorState';
import { PagedTrigger } from '../../types/Trigger';

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
    sort: UsePolicySortReturn;
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

    return <TriggerTableEmptyState/>;
};

const TriggerDetailSectionInternal: React.ForwardRefRenderFunction<TriggerDetailAPI, TriggerDetailSectionProps> = (props, ref) => {

    const { policyId } = props;
    const triggerFilter = useTriggerFilter();
    const getTriggers = useGetPolicyDetailTriggerHistory()
    const [ triggersPerPage, setTriggersPerPage ] = React.useState<number>(50);
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
        const error = (getTriggers.payload as any)?.msg ?? `code: ${getTriggers.status}`;
        triggerErrorState = <TriggerErrorState action={ refresh } policyId={ policyId } error={ error }/>;
    }

    return (
        <Section>
            { getTriggers.hasTriggers === false ? (
                <PolicyDetailTriggerEmptyState/>
            ) : (
                <>
                    <TriggerTableToolbar
                        count={ getTriggers.payload?.count }
                        page={ page }
                        onPaginationChanged={ onPaginationChanged }
                        onPaginationSizeChanged={ onChangeTriggersPerPage }
                        pageCount={ getTriggers.payload?.data?.length }
                        filters={ triggerFilter.filters }
                        setFilters={ triggerFilter.setFilters }
                        clearFilters={ triggerFilter.clearFilter }
                        onExport={ onExport }
                    >
                        <TableContent
                            loading={ getTriggers.loading }
                            payload={ getTriggers.payload }
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
