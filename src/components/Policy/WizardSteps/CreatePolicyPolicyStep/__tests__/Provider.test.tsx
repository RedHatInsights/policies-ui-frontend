// @ts-nocheck
import { act, render } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import * as React from 'react';
import { useState } from 'react';
import { ClientContextProvider, createClient } from 'react-fetching-library';

import { PolicyFilterColumn } from '../../../../../types/Policy/Filters';
import { CreatePolicyStepContextProvider } from '../Provider';

let query;
let setCurrentPage;
let setFilters;
jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
    const real = jest.requireActual('@redhat-cloud-services/insights-common-typescript');
    return {
        ...real,
        useUrlState: (p) => useState(p)
    };
});
jest.mock('../../../../../services/useGetPolicies', () => {
    return {
        useGetPoliciesQuery: () => {
            const response = jest.requireActual('../../../../../services/useGetPolicies').useGetPoliciesQuery();
            if (!response.query.mocked) {
                response.query.mocked = jest.fn(response.query);
            }

            query = response.query.mocked;
            response.query = query;

            return response;
        }
    };
});
jest.mock('../../../../../hooks/usePolicyFilter', () => {
    return {
        usePolicyFilter: (...args) => {
            const response = jest.requireActual('../../../../../hooks/usePolicyFilter').usePolicyFilter(...args);
            setFilters = response.setFilters;
            return response;
        }
    };
});
jest.mock('../../../../../hooks/usePolicyPage', () => {
    return {
        usePolicyPage: (...args) => {
            const response = jest.requireActual('../../../../../hooks/usePolicyPage').usePolicyPage(...args);
            setCurrentPage = response.changePage;
            return response;
        }
    };
});

const client = createClient({
    responseInterceptors: [
        validateSchemaResponseInterceptor
    ]
});

const MockContainer: React.FunctionComponent = (props) => {
    return (
        <ClientContextProvider client={ client }>
            {/* eslint-disable-next-line testing-library/no-node-access */}
            {props.children}
        </ClientContextProvider>
    );
};

describe('src/components/Policy/WizardSteps/CreatePolicyStep/Provider', () => {

    beforeEach(() => fetchMock.restore());

    it('Calls query on updates of page or filters if showCreateStep is true', async () => {
        jest.useFakeTimers();
        fetchMock.mock({
            response: {
                status: 404
            }
        });
        render(
            <MockContainer>
                <CreatePolicyStepContextProvider showCreateStep={ true } />
            </MockContainer>
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        expect(query).toBeCalledTimes(0);

        await act(async () => {
            setCurrentPage(undefined, 5);
            jest.runAllTimers();
        });
        expect(query).toBeCalledTimes(1);

        await act(async () => {
            setFilters[PolicyFilterColumn.NAME]('foo');
            jest.runAllTimers();
        });
        expect(query).toBeCalledTimes(3); // filter change triggers a page set

        await act(async () => {
            setCurrentPage(undefined, 3);
            setFilters[PolicyFilterColumn.NAME]('bar');
            jest.runAllTimers();
        });

        expect(query).toBeCalledTimes(6);

        await act(async () => {
            setFilters[PolicyFilterColumn.NAME]('bar');
            jest.runAllTimers();
        });

        expect(query).toBeCalledTimes(6);
    });

    it('Never calls query on updates of page or filters if showCreateStep is false', async () => {
        jest.useFakeTimers();
        fetchMock.mock({
            response: {
                status: 404
            }
        });
        render(
            <MockContainer>
                <CreatePolicyStepContextProvider showCreateStep={ false } />
            </MockContainer>
        );

        await act(async () => {
            await jest.runAllTimers();
        });

        await act(async () => {
            setCurrentPage(undefined, 5);
            jest.runAllTimers();
        });

        await act(async () => {
            setFilters[PolicyFilterColumn.NAME]('foo');
            jest.runAllTimers();
        });

        await act(async () => {
            setCurrentPage(undefined, 3);
            setFilters[PolicyFilterColumn.NAME]('bar');
            jest.runAllTimers();
        });

        await act(async () => {
            setFilters[PolicyFilterColumn.NAME]('bar');
            jest.runAllTimers();
        });

        expect(query).toBeCalledTimes(0);
    });
});
