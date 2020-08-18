import * as React from 'react';
import { Action } from '../../../types/Policy/Actions';
import { style } from 'typestyle';
import { Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import { Description } from './ExpandedContent/Description';
import { Dates } from './ExpandedContent/Dates';
import { Conditions } from './ExpandedContent/Conditions';
import { OuiaComponentProps, ouiaIdConcat, PFColors } from '@redhat-cloud-services/insights-common-typescript';
import { padding } from 'csstips';
import { Actions } from './ExpandedContent/Actions';
import { getOuiaProps } from '../../../utils/getOuiaProps';

interface ExpandedPolicyContentProps extends OuiaComponentProps {
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
        <Stack { ...getOuiaProps('Policy/Table/Expanded', props) } className={ blockPadding }>
            {props.description &&
                <StackItem className={ descriptionBlockClassName }>
                    <Description ouiaId={ ouiaIdConcat(props.ouiaId, 'description') } description={ props.description }/>
                </StackItem>
            }
            <StackItem className={ dateBlockClassName }>
                <Dates ouiaId={ ouiaIdConcat(props.ouiaId, 'dates') } updated={ props.updated } created={ props.created }/>
            </StackItem>
            <StackItem>
                <Grid>
                    <GridItem className={ conditionsAndActionsBlockClassName } span={ 6 }>
                        <Conditions ouiaId={ ouiaIdConcat(props.ouiaId, 'conditions') } conditions={ props.conditions }/>
                    </GridItem>
                    <GridItem className={ conditionsAndActionsBlockClassName } span={ 6 }>
                        <Actions ouiaId={ ouiaIdConcat(props.ouiaId, 'actions') } actions={ props.actions }/>
                    </GridItem>
                </Grid>
            </StackItem>
        </Stack>
    );
};
