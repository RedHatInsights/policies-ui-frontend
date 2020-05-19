import * as React from 'react';
import { PFVariables } from '../../PFVariables';
import { hyphenate } from '../../../../utils/ComponentUtils';

interface PfVAlignFormProps {
    title: string;
    indx: string;
    showAsRequired?: boolean;
    showInputField?: boolean;
}

export const VAlignForm: React.FunctionComponent<PfVAlignFormProps> = (props) => {
    return (
        <form noValidate className={ PFVariables.Form }>
            <div className={ PFVariables.FormGroup }>
                <label className={ PFVariables.FormLabel } htmlFor={ hyphenate(PFVariables.VerticalAlignLabels, props.indx) }>
                    <span className={ PFVariables.FormLabelText }>{props.title}</span>
                    { props.showAsRequired &&
                       <span className={ PFVariables.FormLabelRequired } aria-hidden="true">&#42;</span> }
                </label>
                { props.showInputField && <input className={ PFVariables.FormControl } type="text"
                    id={ hyphenate(PFVariables.VerticalAlignLabels, props.indx) } name={ hyphenate(PFVariables.VerticalAlignLabels,  props.indx) }
                    required/>}
            </div>
        </form>
    );
};
