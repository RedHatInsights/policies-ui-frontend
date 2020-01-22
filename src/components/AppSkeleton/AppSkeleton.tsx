import * as React from 'react';

import {
    Main,
    PageHeader,
    PageHeaderTitle,
    Section,
    Skeleton,
    Spinner
} from '@redhat-cloud-services/frontend-components';

import { Bullseye } from '@patternfly/react-core';

export const AppSkeleton: React.FunctionComponent = () => {

    return (
        <>
            <PageHeader>
                <div className="pf-c-content">
                    <PageHeaderTitle title={ <Skeleton size="sm"/> }/>
                </div>
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
