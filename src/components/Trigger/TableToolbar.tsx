import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Page } from '../../types/Page';
import { ExporterType, exporterTypeFromString } from '../../utils/exporters/Type';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;

export interface TriggerTableToolbarProps {
    count?: number;
    onPaginationChanged?: OnPaginationPageChangedHandler;
    page: Page;
    pageCount?: number;
    onExport: (type: ExporterType) => void;
}

export const TriggerTableToolbar: React.FunctionComponent<TriggerTableToolbarProps> = (props) => {

    const paginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: props.count || 0,
        page: props.page.index,
        perPage: props.page.size,
        perPageOptions: [],
        onSetPage: props.onPaginationChanged,
        onFirstClick: props.onPaginationChanged,
        onPreviousClick: props.onPaginationChanged,
        onNextClick: props.onPaginationChanged,
        onLastClick: props.onPaginationChanged,
        onPageInput: props.onPaginationChanged,
        isCompact: true,
        variant: PaginationVariant.top
    }), [ props.onPaginationChanged, props.page, props.count ]);

    const exportConfig = React.useMemo(() => {
        const onExport = props.onExport;
        return {
            extraItems: [],
            onSelect: (_event, type: string) => {
                onExport(exporterTypeFromString(type));
            },
            'data-testid': 'trigger-toolbar-export-container'
        };
    }, [ props.onExport ]);

    return (
        <>
            <PrimaryToolbar
                pagination={ paginationProps }
                exportConfig={ exportConfig }
            />
        </>
    );
};
