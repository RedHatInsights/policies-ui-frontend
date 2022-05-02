import { Grid, GridItem, Stack, StackItem } from '@patternfly/react-core';
import { global_BackgroundColor_light_300 } from '@patternfly/react-tokens';
import { OuiaComponentProps, ouiaIdConcat } from '@redhat-cloud-services/insights-common-typescript';
import { padding } from 'csstips';
import * as React from 'react';
import { style } from 'typestyle';

import { Action } from '../../../types/Policy/Actions';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { Actions } from './ExpandedContent/Actions';
import { Conditions } from './ExpandedContent/Conditions';
import { Dates } from './ExpandedContent/Dates';
import { Description } from './ExpandedContent/Description';

interface ExpandedPolicyContentProps extends OuiaComponentProps {
    description?: string;
    updated: Date;
    created: Date;
    conditions: string;
    actions: Action[];
}

const blockPadding = style({
    marginLeft: 24
});

const descriptionBlockClassName = style({
    maxWidth: 800,
    marginBottom: 12,
    marginLeft: 24,
    marginTop: 24
});

const dateBlockClassName = style({
    marginLeft: 24,
    marginBottom: 12
});

const conditionsAndActionsBlockClassName = style({
    backgroundColor: global_BackgroundColor_light_300.var,
    ...padding(18, 14),
    marginLeft: 24,
    marginBottom: 24
});

export const ExpandedContent: React.FunctionComponent<ExpandedPolicyContentProps> = (props) => {

    return (
        <Stack { ...getOuiaProps('Policy/Table/Expanded', props) } className={ blockPadding }>
            {props.description &&
                <StackItem className={ descriptionBlockClassName }>
                    <Description ouiaId={ ouiaIdConcat(props.ouiaId, 'description') } description={ props.description } />
                </StackItem>
            }
            <StackItem className={ dateBlockClassName }>
                <Dates ouiaId={ ouiaIdConcat(props.ouiaId, 'dates') } updated={ props.updated } created={ props.created } />
            </StackItem>
            <StackItem>
                <Grid>
                    <GridItem className={ conditionsAndActionsBlockClassName } span={ 6 }>
                        <Conditions ouiaId={ ouiaIdConcat(props.ouiaId, 'conditions') } conditions={ props.conditions } />
                    </GridItem>
                    <GridItem className={ conditionsAndActionsBlockClassName } span={ 6 }>
                        <Actions ouiaId={ ouiaIdConcat(props.ouiaId, 'actions') } actions={ props.actions } />
                    </GridItem>
                </Grid>
            </StackItem>
        </Stack>
    );
};
