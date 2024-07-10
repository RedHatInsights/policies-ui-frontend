import {
    Breadcrumb, BreadcrumbItem,
    Bullseye,
    Button, ButtonVariant,
    Skeleton,
    Split,
    SplitItem,
    Stack,
    StackItem } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { PageHeader, PageHeaderTitle, Spinner } from '@redhat-cloud-services/frontend-components';
import { BreadcrumbLinkItem, Section } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { linkTo } from '../../Routes';

const skeletonClassName = style({
    width: 200
});

export const PolicyDetailSkeleton: React.FunctionComponent = () => {
    return (
        <>
            <PageHeader data-testid="policy-loading">
                <Stack>
                    <StackItem>
                        <Breadcrumb>
                            <BreadcrumbLinkItem ouiaId="to-list-page" to={ linkTo.listPage() }>
                                Policies
                            </BreadcrumbLinkItem>
                            <BreadcrumbItem>
                                <Skeleton className={ skeletonClassName } />
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </StackItem>
                    <StackItem>
                        <Split>
                            <SplitItem isFilled>
                                <PageHeaderTitle title={ <Skeleton width="25%" /> } />
                            </SplitItem>
                            <SplitItem>
                                <Button isDisabled variant={ ButtonVariant.plain }><EllipsisVIcon /></Button>
                            </SplitItem>
                        </Split>
                    </StackItem>
                </Stack>
            </PageHeader>
            <section className="pf-v5-l-page__main-section pf-v5-c-page__main-section">
                <Section ouiaId="loading-spinner">
                    <Bullseye>
                        <Spinner centered />
                    </Bullseye>
                </Section>
            </section>
        </>
    );
};
