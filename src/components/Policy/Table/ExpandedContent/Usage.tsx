import * as React from 'react';
import { StackItem, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { Messages }  from '../../../../properties/Messages';

const accordianString = 'pf-c-accordion__expanded-content';
const toggleString = 'pf-c-accordion__toggle';

interface UsageProps {
    showHint?: boolean;
    additionalAttributes?: string;
    hint?: string;
    hintTitle?: string;
}
// build the text as we expect it to look but this is manual and not automatic
// We'll need to revisit this later.
class TextItemExtension extends React.Component {
    render() {
        return (
            <TextContent>
                <Text component={ TextVariants.p }>{ Messages.wizards.policy.hints.hintParagraph1 }</Text>
                <Text component={ TextVariants.a } href="#">{ Messages.wizards.policy.hints.hintLinkTitle }</Text>
                <Text component={ TextVariants.h3 }>{ Messages.wizards.policy.hints.hintSyntaxExamplesSection }</Text>
                <Text component={ TextVariants.h4 }>{ Messages.wizards.policy.hints.hintQuestion1 }</Text>
                <Text component={ TextVariants.p }>{ Messages.wizards.policy.hints.hintQuestion1Ans }</Text>
                <Text component={ TextVariants.h4 }>{ Messages.wizards.policy.hints.hintQuestion2 }</Text>
                <Text component={ TextVariants.p }>{ Messages.wizards.policy.hints.hintQuestion2Ans }</Text>
                <Text component={ TextVariants.h4 }>{ Messages.wizards.policy.hints.hintQuestion3 }</Text>
                <Text component={ TextVariants.p }>{ Messages.wizards.policy.hints.hintQuestion3Ans }</Text>
                <Text component={ TextVariants.h4 }>{ Messages.wizards.policy.hints.hintQuestion4 }</Text>
                <Text component={ TextVariants.p }>{ Messages.wizards.policy.hints.hintQuestion4Ans }</Text>
            </TextContent>
        );
    }
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
                            <div className="pf-c-accordion__expanded-content-body"><TextItemExtension/></div>
                        </div>
                    ) : (
                        <div className={ usageState.showHint ? (accordianString + ' pf-m-expanded')  : (accordianString) } hidden>
                            <div className="pf-c-accordion__expanded-content-body"><TextItemExtension/></div>
                        </div>
                    )}
                </div>
            </StackItem>
        </>
    );
};

export default Usage;
