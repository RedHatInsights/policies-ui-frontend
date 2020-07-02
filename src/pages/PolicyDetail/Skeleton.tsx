import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Skeleton, Spinner } from '@redhat-cloud-services/frontend-components';
import {
    Breadcrumb,
    Bullseye,
    Button, ButtonVariant,
    Split,
    SplitItem,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import { Section, BreadcrumbLinkItem } from 'common-code-ui';
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
                                <Button isDisabled variant={ ButtonVariant.plain }><EllipsisVIcon/></Button>
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
