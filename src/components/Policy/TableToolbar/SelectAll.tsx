import * as React from 'react';
import { Dropdown, DropdownItem, DropdownToggle, DropdownToggleCheckbox } from '@patternfly/react-core';
import nextId from 'react-id-generator';

export const SelectAll: React.FunctionComponent = () => {

    const items = [
        <DropdownItem key="none">
            Select none (0 items)
        </DropdownItem>,
        <DropdownItem key="page">
            Select page (x items)
        </DropdownItem>,
        <DropdownItem key="all">
            Select all (y items)
        </DropdownItem>
    ];

    const toggleCheckboxId = nextId();

    return (
        <Dropdown
            toggle={ <DropdownToggle
                splitButtonItems={ [
                    <DropdownToggleCheckbox id={ toggleCheckboxId } key="toggle-checkbox" aria-label="Select / Deselect all"/>
                ] }
            /> }
            dropdownItems={ items }
        >
        </Dropdown>
    );
};
