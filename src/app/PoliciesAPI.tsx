import { Configuration, FactServiceApi, PolicyCrudServiceApi } from '@redhat-cloud-services/policies-client';

export interface PoliciesApi {
    facts: FactServiceApi;
    policies: PolicyCrudServiceApi;
}

const createApi = (): PoliciesApi => {
    const basePath = `/api/policies/v1.0`;
    const configuration = new Configuration({
        basePath
    });

    return {
        facts: new FactServiceApi(configuration),
        policies: new PolicyCrudServiceApi(configuration)
    };
};

export const policiesApi = createApi();
