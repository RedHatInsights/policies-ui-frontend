import { Fact } from '../types/Fact';
import { useQuery } from 'react-fetching-library';
import { actionGetFacts } from '../generated/ActionCreators';

export const actionCreator = actionGetFacts;

export const useGetFactsQuery = (initFetch?: boolean) => useQuery<Fact[]>(actionCreator(), initFetch);
