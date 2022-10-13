import { useEffect, useState } from 'react';

import { useGetFactsQuery } from '../services/useGetFacts';
import { Fact } from '../types/Fact';

export const useFacts = () => {
    const [ facts, setFacts ] = useState<Fact[]>();
    const { data, status } = useGetFactsQuery();

    useEffect(() => {
        if (status === 'success') {
            setFacts(data);
        }
    }, [ data, status, setFacts ]);

    return facts;
};
