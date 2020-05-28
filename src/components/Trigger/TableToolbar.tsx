import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;

export interface TriggerTableToolbarProps {
    count?: number;
    onPaginationChanged?: OnPaginationPageChangedHandler;
    page: number;
    pageCount?: number;
    perPage: number;
}

export const TriggerTableToolbar: React.FunctionComponent<TriggerTableToolbarProps> = (props) => {

    const paginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: props.count || 0,
        page: props.page,
        perPage: props.perPage,
        perPageOptions: [],
        onSetPage: props.onPaginationChanged,
        onFirstClick: props.onPaginationChanged,
        onPreviousClick: props.onPaginationChanged,
        onNextClick: props.onPaginationChanged,
        onLastClick: props.onPaginationChanged,
        onPageInput: props.onPaginationChanged,
        isCompact: true,
        variant: PaginationVariant.right
    }), [ props.onPaginationChanged, props.page, props.perPage, props.count ]);

    return (
        <>
            <PrimaryToolbar
                pagination={ paginationProps }
            />
        </>
    );
};
