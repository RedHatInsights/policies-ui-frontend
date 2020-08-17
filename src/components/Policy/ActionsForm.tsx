import { ArrayHelpers } from 'formik';
import { DeepPartial } from 'ts-essentials';
import { Action, ActionType } from '../../types/Policy/Actions';
import {
    Button,
    Card,
    CardActions,
    CardBody
    , CardHeader, Form,
    Title, CardTitle
} from '@patternfly/react-core';
import * as React from 'react';
import { TimesIcon } from '@patternfly/react-icons';
import { ActionForm } from './ActionForm/ActionForm';
import { assertNever, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { style } from 'typestyle';
import { ActionIcon } from './ActionIcons';

const formClassName = style({
    gridGap: Spacer.MD
});

const cardClassName = style({
    backgroundColor: 'white',
    border: '1px var(--pf-global--BorderColor--200) solid',
    boxShadow: 'none'
});

const marginLeftClassName = style({
    marginLeft: 10,
    display: 'inline'
});

interface ActionsFormProps {
    id: string;
    name: string;
    arrayHelpers: ArrayHelpers;
    actions?: (DeepPartial<Action>| undefined)[];
    isReadOnly?: boolean;
}

const titleForActionType = (actionType: ActionType) => {
    switch (actionType) {
        case ActionType.EMAIL:
            return 'Send email';
        case ActionType.WEBHOOK:
            return 'Send to hook';
        default:
            assertNever(actionType);
    }
};

export const ActionsForm: React.FunctionComponent<ActionsFormProps> = (props) => {
    return (
        <Form className={ formClassName }>
            { props.actions?.map((action, index) => (
                <React.Fragment key={ index }>
                    <Card className={ cardClassName }>
                        <CardHeader data-codemods="true">
                            <CardActions>
                                <Button variant="plain" aria-label="Action" onClick={ props.arrayHelpers.handleRemove(index) }>
                                    <TimesIcon/>
                                </Button>
                            </CardActions>
                            <CardTitle>
                                <>
                                    <ActionIcon actionType={ action?.type }/>
                                    <Title headingLevel="h2" className={ marginLeftClassName } size="md">
                                        { action?.type ? titleForActionType(action.type) : '' }
                                    </Title>
                                </>
                            </CardTitle>
                        </CardHeader>
                        { /* Adding this pf-c-form class is a hack (i think).
                        It looks like We should not use Card inside the Form as it breaks the layout.
                        */ }
                        <CardBody className="pf-c-form">
                            <ActionForm ouiaId={ index.toString() } isReadOnly={ props.isReadOnly } action={ action } prefix={ `actions.${index}` }/>
                        </CardBody>
                    </Card>
                </React.Fragment>
            )) }
        </Form>
    );
};
