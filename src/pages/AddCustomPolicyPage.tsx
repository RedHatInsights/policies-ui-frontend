import * as React from 'react';
import { PageHeader, Main, Section, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import { createPolicy } from '../services/Api';
import { PolicyForm } from '../components/Policy/PolicyForm';
import { DeepPartial } from 'ts-essentials';
import { Policy } from '../types/Policy';

type AddPageProps = {};

const AddCustomPolicyPage: React.FunctionComponent<AddPageProps> = (_props: AddPageProps) => {

    const create = (policy: DeepPartial<Policy>) => {
        const createPolicyPromise = createPolicy(policy as Policy).then(() => Promise.resolve(true));
        createPolicyPromise.catch(error => alert('Found error:' + error.toString()));
        return createPolicyPromise;
    };

    const verify = (_policy: DeepPartial<Policy>) => {
        return Promise.resolve(true);
    };

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title="Add new Policy"/>
            </PageHeader>
            <Main>
                <Section>
                    <PolicyForm
                        isOpen={ true }
                        close={ () => console.log('closing') }
                        verify={ verify }
                        create={ create }
                        initialValue={ { actions: [{}]} }
                    />
                </Section>
            </Main>
        </>
    );
};

export default AddCustomPolicyPage;
