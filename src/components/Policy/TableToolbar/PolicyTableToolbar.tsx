import * as React from 'react';
import { Button, Toolbar, ToolbarGroup, ToolbarItem, Pagination } from '@patternfly/react-core';
import { style } from 'typestyle';
import { SelectAll } from './SelectAll';
import { ExportIcon } from '@patternfly/react-icons';
import { KebabMenu } from './KebabMenu';
import { FilterBy } from './FilterBy';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;
type OnPaginationSizeChangedHandler = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, perPage: number) => void;

interface TablePolicyToolbarProps {
    onCreatePolicy?: () => void;
    onExport?: () => void;

    onPaginationChanged?: OnPaginationPageChangedHandler;
    onPaginationSizeChanged?: OnPaginationSizeChangedHandler;
    page: number;
    perPage: number;
    count?: number;
}

const toolbarClassName = style({
    backgroundColor: '#fff',
    padding: '16px 16px'
});

export const PolicyToolbar: React.FunctionComponent<TablePolicyToolbarProps> = (props) => {
    return (
        <Toolbar className={ toolbarClassName }>
            <ToolbarGroup>
                <ToolbarItem><SelectAll/></ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
                <FilterBy/>
            </ToolbarGroup>
            <ToolbarGroup>
                <ToolbarItem><Button onClick={ props.onCreatePolicy }>Create policy</Button></ToolbarItem>
                <ToolbarItem>
                    <Button onClick={ props.onExport } variant="plain" aria-label="Export">
                        <ExportIcon/>
                    </Button>
                </ToolbarItem>
                <ToolbarItem>
                    <KebabMenu/>
                </ToolbarItem>
            </ToolbarGroup>
            <Pagination
                itemCount={ props.count || 0 }
                page={ props.page }
                perPage={ props.perPage }
                onSetPage={ props.onPaginationChanged }
                onFirstClick={ props.onPaginationChanged }
                onPreviousClick={ props.onPaginationChanged }
                onNextClick={ props.onPaginationChanged }
                onLastClick={ props.onPaginationChanged }
                onPageInput={ props.onPaginationChanged }
                onPerPageSelect={ props.onPaginationSizeChanged }

                isCompact
            />
        </Toolbar>
    );
};
