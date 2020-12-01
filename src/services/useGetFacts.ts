import { useQuery } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';

export const actionCreator = Operations.GetFacts.actionCreator;

export const useGetFactsQuery = (initFetch?: boolean) => useQuery(actionCreator(), initFetch);
