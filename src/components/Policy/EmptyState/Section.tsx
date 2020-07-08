import * as React from 'react';
import { Button, EmptyState as EmptyStatePf, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { style } from 'typestyle';
import { calc } from 'csx';
import { Spacer } from '@redhat-cloud-services/insights-common-typescript';

const emptyStateClassName = style({
    paddingTop: calc(`${ Spacer.XL_3 }px - var(--pf-c-page__main-section--PaddingTop)`)
});

export interface EmptyStateSectionProps {
    icon?: React.ComponentType<any>;
    iconColor?: string;
    title: string;
    content: React.ReactNode;
    action?: () => void;
    actionNode?: React.ReactNode;
    actionLabel?: string;
    className?: string;
}

export const EmptyStateSection: React.FunctionComponent<EmptyStateSectionProps> = (props) => (
    <EmptyStatePf variant={ EmptyStateVariant.full } className={ `${emptyStateClassName} ${props.className ? props.className : ''} ` }>
        { props.icon && <EmptyStateIcon icon={ props.icon } color={ props.iconColor } /> }
        <Title headingLevel="h5" size="lg">
            { props.title }
        </Title>
        <EmptyStateBody>
            { props.content }
        </EmptyStateBody>
        { props.actionNode }
        { props.actionLabel && (
            <Button variant="primary" onClick={ props.action } isDisabled={ !props.action } >{ props.actionLabel }</Button>
        ) }
    </EmptyStatePf>
);
