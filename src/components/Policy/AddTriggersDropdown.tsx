import { Button, ButtonVariant, Dropdown, DropdownItem, TextContent, TextVariants, Text } from '@patternfly/react-core';
import { Toggle } from '@patternfly/react-core/dist/js/components/Dropdown/Toggle';
import { AngleDownIcon } from '@patternfly/react-icons';
import { global_spacer_md, global_palette_black_600 } from '@patternfly/react-tokens';
import {
    Environments,
    getInsights,
    getInsightsEnvironment,
    OuiaComponentProps
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { Messages } from '../../properties/Messages';
import { ActionType } from '../../types/Policy/Actions';
import { getOuiaProps } from '../../utils/getOuiaProps';

interface AddTriggersDropdownProps extends OuiaComponentProps {
    onTypeSelected: (type: ActionType) => void;
    isTypeEnabled: (type: ActionType) => boolean;
}

const dropdownClassName = style({
    marginBottom: 16
});

const fedrampContent = style({
    textAlign: 'center',
    paddingTop: global_spacer_md.value
});

const fedrampContentText = style({
    color: global_palette_black_600.value
});

export const AddTriggersDropdown: React.FunctionComponent<AddTriggersDropdownProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState<boolean>(false);

    const typeSelected = type => {
        props.onTypeSelected(type);
        setOpen(false);
    };

    const isFedramp = React.useMemo(() => {
        const env = getInsightsEnvironment(getInsights());
        return Environments.govProd.includes(env) || Environments.govStage.includes(env);
    }, []);

    if (isFedramp) {
        return <TextContent className={ fedrampContent }>
            <Text component={ TextVariants.h3 }>No available trigger actions</Text>
            <Text component={ TextVariants.p } className={ fedrampContentText }>
                Your organization&apos;s instance of Insights currently has no allowed actions.<br />
                Notifications cannot be sent out of this instance due to FedRamp requirements.
            </Text>
            <Text component={ TextVariants.p } className={ fedrampContentText }>
                Triggered policies can be viewed in the Insights UI on the Policies page.
            </Text>
        </TextContent>;
    }

    const items = [ ActionType.NOTIFICATION ]
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
                <Button component="a" variant={ ButtonVariant.link } isInline> Add trigger actions <AngleDownIcon /> </Button>
            </Toggle> }
            { ...getOuiaProps('Policy/Wizard/AddTrigger', props) }
        />
    );
};
