import * as React from 'react';
import { hyphenate } from '../../../../utils/ComponentUtils';
import { Form, FormGroup } from '@patternfly/react-core';

const formName = 'simple-form';//label name

// Uses the following component to create i)Form labels with optional
// ii)required iii)popover iv)HelpText, etc..
export class VAlignForm extends React.Component<{
    title?: string;
    identification?: string;
    showAsRequired?: boolean;
    showPopover?: boolean;
    popoverMessage?: string;
    helpText?: string;
    children?: React.ReactNode;
}> {
    render() {
        return (
            <Form>
                { !this.props.showAsRequired && <FormGroup label={ this.props.title }
                    fieldId={ hyphenate(formName, (this.props.identification ? this.props.identification : '')) }
                />}
                { this.props.showAsRequired && <FormGroup label={ this.props.title } isRequired
                    fieldId={ hyphenate(formName, (this.props.identification ? this.props.identification : '')) }/>
                }
            </Form>
        );
    }
}
