import { useEffect, useState } from 'react';

import { useGetFactsQuery } from '../services/useGetFacts';
import { Fact } from '../types/Fact';

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
