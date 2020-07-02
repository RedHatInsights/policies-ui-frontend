import * as React from 'react';
import { Action } from '../../../types/Policy/Actions';
import { style } from 'typestyle';
import { Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import { Description } from './ExpandedContent/Description';
import { Dates } from './ExpandedContent/Dates';
import { Conditions } from './ExpandedContent/Conditions';
import { PFColors } from 'common-code-ui';
import { padding } from 'csstips';
import { Actions } from './ExpandedContent/Actions';

interface ExpandedPolicyContentProps {
    description?: string;
    updated: Date;
    created: Date;
    conditions: string;
    actions: Action[];
}

const blockPadding = style({
    margin: 12
});

const descriptionBlockClassName = style({
    maxWidth: 800,
    marginBottom: 12
});

const dateBlockClassName = style({
    marginBottom: 12
});

const conditionsAndActionsBlockClassName = style({
    backgroundColor: PFColors.GlobalBackgroundColorLight300,
    ...padding(18, 14),
    margin: 5
});

export const ExpandedContent: React.FunctionComponent<ExpandedPolicyContentProps> = (props) => {

    return (
        <Stack className={ blockPadding }>
            {props.description &&
                <StackItem className={ descriptionBlockClassName }>
                    <Description description={ props.description }/>
                </StackItem>
            }
            <StackItem className={ dateBlockClassName }>
                <Dates updated={ props.updated } created={ props.created }/>
            </StackItem>
            <StackItem>
                <Grid>
                    <GridItem className={ conditionsAndActionsBlockClassName } span={ 6 }>
                        <Conditions conditions={ props.conditions }/>
                    </GridItem>
                    <GridItem className={ conditionsAndActionsBlockClassName } span={ 6 }>
                        <Actions actions={ props.actions }/>
                    </GridItem>
                </Grid>
            </StackItem>
        </Stack>
    );
};
