import * as React from 'react';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';

export const KebabMenu: React.FunctionComponent = () => {

    const items = [
        <DropdownItem key="stuff">
            Stuff
        </DropdownItem>
    ];

    return (
        <Dropdown
            toggle={ <KebabToggle/> }
            position={ DropdownPosition.right }
            dropdownItems={ items }
            isPlain

        >
        </Dropdown>
    );
};
