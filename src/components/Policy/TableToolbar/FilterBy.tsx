import * as React from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownToggle,
    InputGroup,
    TextInput,
    ToolbarItem
} from '@patternfly/react-core';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons';
import { style } from 'typestyle';

const searchContainer = style({
    position: 'relative'
});

const searchIconClass = style({
    position: 'absolute',
    top: 9,
    right: 9
});

export const FilterBy: React.FunctionComponent = () => {

    const items = [
        <DropdownItem key="stuff">
            Stuff
        </DropdownItem>
    ];

    return (
        <ToolbarItem>
            <InputGroup>
                <Dropdown
                    toggle={ <DropdownToggle
                        splitButtonItems={ [
                            <FilterIcon size="md" key="filter-icon"/>
                        ] }
                    />  }
                    dropdownItems={ items }
                />
                <div className={ searchContainer }>
                    <TextInput
                        placeholder="Filter by"
                        aria-label="Filter by"
                    />
                    <SearchIcon className={ searchIconClass } size="sm"/>
                </div>
            </InputGroup>
        </ToolbarItem>
    );
};
