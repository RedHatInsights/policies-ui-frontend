import { Fact } from '../types/Fact';
import Config from '../config/Config';
import { useQuery } from 'react-fetching-library';
import { actionBuilder } from './Api/ActionBuilder';

const urls = Config.apis.urls;

export const actionCreator = () => actionBuilder('GET', urls.facts).build();

export const useGetFactsQuery = (initFetch?: boolean) => useQuery<Fact[]>(actionCreator(), initFetch);
