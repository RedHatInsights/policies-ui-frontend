import * as React from 'react';
import { hyphenate } from '../../../../utils/ComponentUtils';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';

interface VAlignFormProps {
    title?: string;
    identification?: string;
    showAsRequired?: boolean;
    showPopover?: boolean;
    showHelpText?: boolean;
    showInputField?: boolean;
    showInputFieldAsRequired?: boolean;
    popoverMessage?: string;
    helpText?: string;
    children?: React.ReactNode;
}

const formName = 'simple-form';//label name
const formInputName = 'simple-form-input';//label name

// Uses the following component to create i)Form labels with optional
// ii)required iii)popover iv)HelpText, etc..
export class VAlignForm extends React.Component< VAlignFormProps> {
    constructor(props) {
        super(props);
    }
    handleTextInputChange1() {
        //override with implementation logic
    }

    render() {
        return (
            <Form>
                { !this.props.showInputField && <FormGroup label={ this.props.title }
                    fieldId={ hyphenate(formName, (this.props.identification ? this.props.identification : '')) }
                    helperText={ this.props.showHelpText && this.props.helpText } isRequired={ this.props.showAsRequired }
                />}
                { this.props.showInputField &&
                <FormGroup label={ this.props.title }
                    fieldId={ hyphenate(formName, (this.props.identification ? this.props.identification : '')) }
                    helperText={ this.props.showHelpText && this.props.helpText } isRequired={ this.props.showAsRequired }>
                    <TextInput
                        isRequired={ this.props.showInputFieldAsRequired }
                        type="text"
                        id={ hyphenate(formInputName, (this.props.identification ? this.props.identification : '')) }
                        name={ hyphenate(formInputName, (this.props.identification ? this.props.identification : '')) }
                        aria-describedby="simple-form-name-helper"
                        value="(change me)"
                        onChange={ this.handleTextInputChange1 }
                    />
                </FormGroup>
                }
            </Form>
        );
    }
}
