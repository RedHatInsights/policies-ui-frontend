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

const marginTopClassName = style({
    marginTop: 10
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
        <Form>
            { props.actions?.map((action, index) => (
                <React.Fragment key={ index }>
                    <Card className={ marginTopClassName }>
                        <CardHead>
                            <CardActions>
                                <Button variant="plain" aria-label="Action" onClick={ props.arrayHelpers.handleRemove(index) }>
                                    <TimesIcon/>
                                </Button>
                            </CardActions>
                            <CardHeader>
                                <Title size="sm">{ action?.type ? titleForActionType(action.type) : '' }</Title>
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
