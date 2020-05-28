import * as React from 'react';
import { getInsights } from '../../utils/Insights';

interface RenderIfProps {
    renderIfBeta: boolean;
}

interface ChildrenRequiredProps {
    children: React.ReactNode;
}

const RenderIf: React.FunctionComponent<RenderIfProps> = (props) => {
    const isBeta = getInsights().chrome.isBeta();
    if (props.renderIfBeta === isBeta) {
        return <>{ props.children }</>;
    }

    return <></>;
};

export const BetaIf: React.FunctionComponent<ChildrenRequiredProps> = (props) => {
    return <RenderIf renderIfBeta={ true }>{ props.children }</RenderIf>;
};

export const BetaIfNot: React.FunctionComponent<ChildrenRequiredProps> = (props) => {
    return <RenderIf renderIfBeta={ false }>{ props.children }</RenderIf>;
};

export const BetaElse: React.FunctionComponent<ChildrenRequiredProps> = (props) => {
    return <RenderIf renderIfBeta={ false }>{ props.children }</RenderIf>;
};

interface BetaDetectorProps {
    children: [ ReturnType<typeof BetaIf>, ReturnType<typeof BetaElse>?] | [ ReturnType<typeof BetaIfNot> ];
}

export const BetaDetector: React.FunctionComponent<BetaDetectorProps> = (props) => {
    return <>{ props.children }</>;
};
