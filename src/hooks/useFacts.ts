import { useEffect, useState } from 'react';
import { Fact } from '../types/Fact';
import { useGetFactsQuery } from '../services/useGetFacts';

export const useFacts = () => {
    const [ facts, setFacts ] = useState<Fact[]>();
    const { payload: factsPayload } = useGetFactsQuery(true);

    useEffect(() => {
        if (factsPayload?.status === 200) {
            setFacts(factsPayload.value);
        }
    }, [ factsPayload, setFacts ]);

    return facts;
};
