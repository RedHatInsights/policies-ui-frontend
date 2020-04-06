import { ArrayHelpers } from 'formik';
import { DeepPartial } from 'ts-essentials';
import { Action, ActionType } from '../../types/Policy/Actions';
import {
    Button,
    Card,
    CardActions,
    CardBody,
    CardHead, CardHeader, Form,
    Title
} from '@patternfly/react-core';
import * as React from 'react';
import { TimesIcon } from '@patternfly/react-icons';
import { ActionForm } from './ActionForm/ActionForm';
import { assertNever } from '../../utils/Assert';
import { style } from 'typestyle';
import { ActionIcon } from './ActionIcons';
import { Spacer } from '../../utils/Spacer';

const formClassName = style({
    gridGap: Spacer.MD
});

const cardClassName = style({
    backgroundColor: 'white',
    border: '1px var(--pf-global--BorderColor--200) solid',
    boxShadow: 'none'
});

const marginLeftClassName = style({
    marginLeft: 10
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
                        <CardHead>
                            <CardActions>
                                <Button variant="plain" aria-label="Action" onClick={ props.arrayHelpers.handleRemove(index) }>
                                    <TimesIcon/>
                                </Button>
                            </CardActions>
                            <CardHeader>
                                <>
                                    <ActionIcon actionType={ action?.type }/>
                                    <Title className={ marginLeftClassName } size="sm">
                                        { action?.type ? titleForActionType(action.type) : '' }
                                    </Title>
                                </>
                            </CardHeader>
                        </CardHead>
                        { /* Adding this pf-c-form class is a hack (i think).
                        It looks like We should not use Card inside the Form as it breaks the layout.
                        */ }
                        <CardBody className="pf-c-form">
                            <ActionForm isReadOnly={ props.isReadOnly } action={ action } prefix={ `actions.${index}` }/>
                        </CardBody>
                    </Card>
                </React.Fragment>
            )) }
        </Form>
    );
};
