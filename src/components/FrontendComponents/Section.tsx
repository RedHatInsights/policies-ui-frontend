import * as React from 'react';
import { Section as IFCSection, DarkContext } from '@redhat-cloud-services/frontend-components';
import { classes } from 'typestyle';

type SectionProps = {
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
};

export const Section: React.FunctionComponent<SectionProps> = (props) => {
    return (
        <DarkContext.Consumer>
            { (theme = 'light') => {
                const className = classes(
                    props.className,
                    'pf-l-page__main-section',
                    'pf-c-page__main-section',
                    theme === 'dark' ? 'pf-m-dark-200' : '',
                    theme === 'light' ? 'pf-m-light' : ''
                );
                return <IFCSection style={ props.style } className={ className }> { props.children } </IFCSection>;
            }}
        </DarkContext.Consumer>
    );
};
