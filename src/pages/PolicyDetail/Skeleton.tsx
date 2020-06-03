import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Skeleton, Spinner } from '@redhat-cloud-services/frontend-components';
import {
    Breadcrumb,
    Bullseye,
    Dropdown,
    KebabToggle,
    Split,
    SplitItem,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { Section } from '../../components/FrontendComponents/Section';
import { BreadcrumbLinkItem } from '../../components/Wrappers/BreadcrumbLinkItem';
import { linkTo } from '../../Routes';

export const PolicyDetailSkeleton: React.FunctionComponent = () => {
    return (
        <>
            <PageHeader>
                <Stack>
                    <StackItem>
                        <Breadcrumb>
                            <BreadcrumbLinkItem to={ linkTo.listPage() }>
                                Policies
                            </BreadcrumbLinkItem>
                            <Skeleton size="sm"/>
                        </Breadcrumb>
                    </StackItem>
                    <StackItem>
                        <Split>
                            <SplitItem isFilled>
                                <PageHeaderTitle title={ <Skeleton size="sm"/> } />
                            </SplitItem>
                            <SplitItem>
                                <Dropdown toggle={ <KebabToggle
                                    isDisabled={ true }
                                /> }
                                />
                            </SplitItem>
                        </Split>
                    </StackItem>
                </Stack>
            </PageHeader>
            <Main>
                <Section>
                    <Bullseye>
                        <Spinner centered/>
                    </Bullseye>
                </Section>
            </Main>
        </>
    );
};
