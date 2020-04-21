import * as React from 'react';
import { StackItem, TextContent, Text, TextVariants, Expandable } from '@patternfly/react-core';
import { Messages }  from '../../../../properties/Messages';
import { style } from 'typestyle';

const codeClass = style({
    fontFamily: 'monospace',
    fontSize: '14px',
    fontStyle: 'default'
});
const linkMarginClassName = style({
    marginBottom: 5
});
const padLeftClassName = style({
    marginLeft: 20
});

// build the text as we expect it to look but this is manual and not automatic
// We'll need to revisit this later.
class TextItemExtension extends React.Component {
    render() {
        return (
            <TextContent className={ padLeftClassName } >
                <Text component={ TextVariants.p }>{ Messages.wizards.policy.hints.hintParagraph1 }</Text>
                <Text component={ TextVariants.a } className={ linkMarginClassName } href="#">{ Messages.wizards.policy.hints.hintLinkTitle }</Text>
                <Text component={ TextVariants.h5 } className="lg">{ Messages.wizards.policy.hints.hintSyntaxExamplesSection }</Text>
                <Text >{ Messages.wizards.policy.hints.hintQuestion1 }</Text>
                <Text component={ TextVariants.p } className={ codeClass }><i>{ Messages.wizards.policy.hints.hintQuestion1Ans }</i></Text>
                <Text >{ Messages.wizards.policy.hints.hintQuestion2 }</Text>
                <Text component={ TextVariants.p } className={ codeClass }><i>{ Messages.wizards.policy.hints.hintQuestion2Ans }</i></Text>
                <Text >{ Messages.wizards.policy.hints.hintQuestion3 }</Text>
                <Text component={ TextVariants.p } className={ codeClass }><i>{ Messages.wizards.policy.hints.hintQuestion3Ans }</i></Text>
                <Text >{ Messages.wizards.policy.hints.hintQuestion4 }</Text>
                <Text component={ TextVariants.p } className={ codeClass }><i>{ Messages.wizards.policy.hints.hintQuestion4Ans }</i></Text>
            </TextContent>
        );
    }
}
const Usage: React.FunctionComponent = (_props) => {
    return (
        <>
            <StackItem>
                <Expandable toggleText={ Messages.wizards.policy.hints.hintTitle }>
                    <TextItemExtension/>
                </Expandable>
            </StackItem>
        </>
    );
};

export default Usage;
