import * as React from 'react';
import {
    Divider,
    Stack,
    StackItem,
    Text,
    TextContent, TextList, TextListItem, TextListItemVariants,
    TextListVariants,
    Title,
    TitleSize
} from '@patternfly/react-core';
import { EnvelopeIcon, HashtagIcon } from '@patternfly/react-icons';
import { style } from 'typestyle';
import { Action, ActionType } from '../../../../types/Policy/Actions';
import { Messages } from '../../../../properties/Messages';
import { assertNever } from '../../../../utils/Assert';
import { join } from '../../../../utils/ComponentUtils';
import { IconType } from '@patternfly/react-icons/dist/js/createIcon';

interface ActionsProps {
    actions: Action[];
}

const titleClassName = style({
    marginBottom: 5
});

const titleActionClassName = style({
    marginBottom: 5,
    marginLeft: 10
});

const wrapperClassName = style({
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10
});

const actionContentWrapperClassName = style({
    marginLeft: 25,
    marginBottom: 8,
    marginTop: 8
});

const ActionWrapper: React.FunctionComponent<{
    title: string;
    icon: IconType;
}> = (props) => {
    return (
        <StackItem className={ wrapperClassName }>
            { <props.icon/> }
            <Title className={ titleActionClassName } size={ TitleSize.md }>{ props.title }</Title>
            { props.children &&
                <div className={ actionContentWrapperClassName }>
                    { props.children }
                </div>
            }
        </StackItem>
    );
};

const getActions = (actions: Action[]) => {
    const elements: React.ReactElement<React.ReactFragment>[] = [];
    for (const index in actions) {
        const action = actions[index];
        switch (action.type) {
            case ActionType.EMAIL:
                elements.push((
                    <React.Fragment key={ index }>
                        <ActionWrapper title="Send Email" icon={ EnvelopeIcon }/>
                    </React.Fragment>
                ));
                break;
            case ActionType.WEBHOOK:
                elements.push((
                    <React.Fragment key={ index }>
                        <ActionWrapper title="Send to Hook" icon={ HashtagIcon }>
                            <TextContent>
                                <TextList component={ TextListVariants.dl }>
                                    <TextListItem component={ TextListItemVariants.dt }> Endpoint </TextListItem>
                                    <TextListItem component={ TextListItemVariants.dd }> { action.endpoint }</TextListItem>
                                </TextList>
                            </TextContent>
                        </ActionWrapper>
                    </React.Fragment>
                ));
                break;
            default:
                assertNever(action);
        }
    }

    return join(elements, Divider);
};

export const Actions: React.FunctionComponent<ActionsProps> = (props) => {

    return (
        <>
            <Stack>
                <StackItem>
                    <Title className={ titleClassName } size={ TitleSize.md }>Run Actions</Title>
                </StackItem>
                {
                    props.actions.length === 0 ? (
                        <Text> { Messages.tables.policy.emptyState.noActions } </Text>
                    ) : getActions(props.actions)
                }
            </Stack>
        </>
    );
};
