import * as React from 'react';
import { ActionType } from '../../types/Policy/Actions';
import { Button, ButtonVariant, Dropdown, DropdownItem } from '@patternfly/react-core';
import { Messages } from '../../properties/Messages';
import { Toggle } from '@patternfly/react-core/dist/js/components/Dropdown/Toggle';
import { AngleDownIcon } from '@patternfly/react-icons';
import { style } from 'typestyle';
import { getInsights, OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';

interface AddTriggersDropdownProps extends OuiaComponentProps {
    onTypeSelected: (type: ActionType) => void;
    isTypeEnabled: (type: ActionType) => boolean;
}

const dropdownClassName = style({
    marginBottom: 16
});

export const AddTriggersDropdown: React.FunctionComponent<AddTriggersDropdownProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState<boolean>(false);

    const typeSelected = type => {
        props.onTypeSelected(type);
        setOpen(false);
    };

    const isProd = getInsights().chrome.isProd;

    const items = Object.values(ActionType)
    .filter(actionType => {
        return !isProd || actionType !== ActionType.NOTIFICATION;
    })
    .map(type =>
        <DropdownItem
            key={ type }
            onClick={ () => typeSelected(type) }
            isDisabled={ !props.isTypeEnabled(type) }
        >
            { Messages.components.actionType[type] }
        </DropdownItem>);

    return (
        <Dropdown
            isOpen={ isOpen }
            dropdownItems={ items }
            isPlain
            className={ dropdownClassName }
            toggle={ <Toggle isPlain onToggle={ open => setOpen(open) } id="add-action-toggle">
                <Button component="a" variant={ ButtonVariant.link } isInline> Add trigger actions <AngleDownIcon/> </Button>
            </Toggle> }
            { ...getOuiaProps('Policy/Wizard/AddTrigger', props) }
        />
    );
};
