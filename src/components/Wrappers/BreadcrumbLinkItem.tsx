import * as React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem, BreadcrumbItemProps } from '@patternfly/react-core';

type BreadcrumbLinkItemProps = Omit<BreadcrumbItemProps, 'component'>;
type LinkAdapterProps = any & {
    href: string;
};

const LinkAdapter: React.FunctionComponent<LinkAdapterProps> = (props) => {
    const { href, ...restProps } = props;
    return (
        <Link to={ href } { ...restProps }>{ props.children }</Link>
    );
};

export const BreadcrumbLinkItem: React.FunctionComponent<BreadcrumbLinkItemProps> = (props) => {
    return (
        <BreadcrumbItem
            { ...props }
            component={ LinkAdapter }
        >
            { props.children }
        </BreadcrumbItem>
    );
};
