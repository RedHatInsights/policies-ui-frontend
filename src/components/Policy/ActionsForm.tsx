import { ArrayHelpers } from 'formik';
import { DeepPartial } from 'ts-essentials';
import { Action, ActionType } from '../../types/Policy/Actions';
import {
    ActionGroup,
    Button, capitalize,
    Card,
    CardActions,
    CardBody,
    CardHead,
    FormSelectOption,
    Title
} from '@patternfly/react-core';
import * as React from 'react';
import { TimesIcon } from '@patternfly/react-icons';
import { FormSelect } from '../Formik/Patternfly';
import { ActionForm } from './ActionForm/ActionForm';

interface ActionsFormProps {
    arrayHelpers: ArrayHelpers;
    actions?: (DeepPartial<Action>| undefined)[];
}

export const ActionsForm = (props: ActionsFormProps) => {

    return (
        <>
            <Title headingLevel="h4" size="2xl">Actions</Title>
            { props.actions?.map((action, index) => (
                <React.Fragment key={ index }>
                    <Card isHoverable>
                        { props.actions?.length && props.actions.length > 1 ? (
                            <CardHead>
                                <CardActions>
                                    <Button variant="plain" aria-label="Action" onClick={ props.arrayHelpers.handleRemove(index) }>
                                        <TimesIcon/>
                                    </Button>
                                </CardActions>
                            </CardHead>
                        ) : null}
                        { /* Adding this pf-c-form class is a hack (i think).
                        It looks like We should not use Card inside the Form as it breaks the layout.
                        */ }
                        <CardBody className="pf-c-form">
                            <FormSelect id={ `actions.${index}.type` } name={ `actions.${index}.type` } label="Type">
                                <FormSelectOption value="" label="Select an Action type"/>
                                { Object.values(ActionType).map(type => <FormSelectOption
                                    key={ type }
                                    label={ capitalize(type) }
                                    value={ type }/>)}
                            </FormSelect>
                            <ActionForm action={ action } prefix={ `actions.${index}` }/>
                        </CardBody>
                    </Card>
                </React.Fragment>
            )) }
            <ActionGroup>
                <Button variant="primary" onClick={ props.arrayHelpers.handlePush({}) }>+ Add action</Button>
            </ActionGroup>
        </>
    );
};
