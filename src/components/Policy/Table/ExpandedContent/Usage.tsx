import * as React from 'react';
import { StackItem } from '@patternfly/react-core';
import { Messages }  from '../../../../properties/Messages';

const accordianString = 'pf-c-accordion__expanded-content';
const toggleString = 'pf-c-accordion__toggle';

interface UsageProps {
    showHint?: boolean;
    additionalAttributes?: string;
    hint?: string;
    hintTitle?: string;
}
type HintDisplay= {
    display: boolean;
}

const Usage: React.FunctionComponent<UsageProps> = (_props) => {
    const [ usageState, setUsageState ] = React.useState<UsageProps>({ ..._props, showHint: false });
    const change = () =>{
        setUsageState({ ..._props, showHint: !usageState.showHint });
    };

    return (
        <>
            <StackItem>
                <div className="pf-c-accordion">
                    <h3>
                        <button className={ usageState.showHint ? (toggleString + ' pf-m-expanded') : (toggleString + '') }
                            aria-expanded={ usageState.showHint } onClick={ () => change() }>
                            <span className="pf-c-accordion__toggle-text">{ usageState.hintTitle }</span>
                            <i className="fas fa-angle-right pf-c-accordion__toggle-icon" aria-hidden='true'></i>
                        </button>
                    </h3>
                    {usageState.showHint ? (
                        <div className={ usageState.showHint ? (accordianString + ' pf-m-expanded')  : (accordianString) }>
                            <div className="pf-c-accordion__expanded-content-body">{ Messages.wizards.policy.hints.hintValue }</div>
                        </div>
                    ) : (
                        <div className={ usageState.showHint ? (accordianString + ' pf-m-expanded')  : (accordianString) } hidden>
                            <div className="pf-c-accordion__expanded-content-body">{ Messages.wizards.policy.hints.hintValue }</div>
                        </div>
                    )}
                </div>
            </StackItem>
        </>
    );
};

export default Usage;
