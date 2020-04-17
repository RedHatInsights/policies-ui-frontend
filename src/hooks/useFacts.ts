import { useEffect, useState } from 'react';
import { Fact } from '../types/Fact';
import { useGetFactsQuery } from '../services/useGetFacts';

export const useFacts = () => {
    const [ facts, setFacts ] = useState<Fact[]>();
    const { payload: factsPayload } = useGetFactsQuery(true);

    useEffect(() => {
        if (factsPayload) {
            setFacts(factsPayload);
        }
    }, [ factsPayload, setFacts ]);

    return facts;
};
