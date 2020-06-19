import * as React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../app/AppContext';

interface RenderIfProps {
    renderIfBeta: boolean;
}

const RenderIf: React.FunctionComponent<RenderIfProps> = (props) => {
    const { insights } = useContext(AppContext);
    const isBeta = insights.chrome.isBeta();
    if (props.renderIfBeta === isBeta) {
        return <>{ props.children }</>;
    }

    return <></>;
};

interface ChildrenRequiredProps {
    children: React.ReactNode;
}

export const BetaIf: React.FunctionComponent<ChildrenRequiredProps> = (props) => {
    return <RenderIf renderIfBeta={ true }>{ props.children }</RenderIf>;
};

export const BetaIfNot: React.FunctionComponent<ChildrenRequiredProps> = (props) => {
    return <RenderIf renderIfBeta={ false }>{ props.children }</RenderIf>;
};

type BetaIfOrBetaIfNotType = ReturnType<typeof BetaIf | typeof BetaIfNot>;

type BetaDetectorProps = {
    children: Array<BetaIfOrBetaIfNotType> | BetaIfOrBetaIfNotType;
}

export const BetaDetector: React.FunctionComponent<BetaDetectorProps> = (props) => {
    let betaIfCount = 0;
    let betaIfNotCount = 0;
    React.Children.forEach(props.children, child => {
        if (child && (child as any).type) {
            const type = (child as any).type;
            if (type === BetaIf) {
                ++betaIfCount;
            } else if (type === BetaIfNot) {
                ++betaIfNotCount;
            } else {
                throw new Error('Only BetaIf and BetaIfNot are accepted Elements in BetaDecorator');
            }
        }
    });

    if (betaIfCount > 1 || betaIfNotCount > 1) {
        throw new Error('Only one of each BetaIf and BetaIfNot is allowed on each BetaDetector');
    }

    return <>{ props.children }</>;
};
