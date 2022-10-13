import { useQuery } from '@tanstack/react-query';

import { policiesApi } from '../app/PoliciesAPI';

export const useGetFactsQuery = () => useQuery([ 'facts' ], async () => {
    const response = await policiesApi.facts.getFacts();
    return response.data;
});
