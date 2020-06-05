import * as React from 'react';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';

interface ActionsProps {
    edit: () => void;
    duplicate: () => void;
    delete: () => void;
    changeEnabled: (isEnabled: boolean) => void;
    disabled: boolean;
    isEnabled: boolean;
    loadingEnabledChange: boolean;
}

export const PolicyDetailActions: React.FunctionComponent<ActionsProps> = (props) => {

    const [ isOpen, setOpen ] = React.useState(false);

    const onSelect = React.useCallback(() => {
        setOpen(false);
    }, []);

    const items = React.useMemo(() => {
        const changeEnabled = props.changeEnabled;
        const localItems: Array<React.ReactNode> = [];
        if (props.isEnabled) {
            localItems.push(
                <DropdownItem
                    isDisabled={ props.loadingEnabledChange }
                    onClick={ () => changeEnabled(false) }
                    key="disable"
                >
                    Disable
                </DropdownItem>);
        } else {
            localItems.push(
                <DropdownItem
                    isDisabled={ props.loadingEnabledChange }
                    onClick={ () => changeEnabled(true) }
                    key="enable"
                >
                    Enable
                </DropdownItem>);
        }

        localItems.push(
            <DropdownItem key="edit" onClick={ props.edit }>Edit</DropdownItem>,
            <DropdownItem key="duplicate" onClick={ props.duplicate }>Duplicate</DropdownItem>,
            <DropdownItem key="delete" onClick={ props.delete }>Delete</DropdownItem>
        );

        return localItems;
    }, [ props.isEnabled, props.changeEnabled, props.edit, props.duplicate, props.delete, props.loadingEnabledChange ]);

    return (
        <Dropdown
            position={ DropdownPosition.right }
            onSelect={ onSelect }
            toggle={ <KebabToggle
                data-testid="policy-detail-actions-button"
                isDisabled={ props.disabled }
                onToggle={ setOpen }
                id="policy-detail-actions-menu"/> }
            isOpen={ isOpen }
            isPlain
            dropdownItems={ items }
        />
    );
};
