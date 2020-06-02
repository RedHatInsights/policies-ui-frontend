import { Trigger } from '../../../types/Trigger';
import * as React from 'react';
import { Direction, Page } from '../../../types/Page';
import { useState } from 'react';

export interface UsePagedTriggersResponse {
    count: number;
    pagedTriggers: Array<Trigger>;
}

export const usePagedTriggers = (triggers: Array<Trigger> | undefined, page: Page): UsePagedTriggersResponse => {
    const [ count, setCount ] = useState(0);
    const [ pagedTriggers, setPagedTriggers ] = useState<Array<Trigger>>([]);

    const updateTriggers = React.useCallback((triggers: Trigger[]) => {
        let processedTriggers = triggers;
        const sortBy = page.sort;
        if (sortBy) {
            processedTriggers = [ ...triggers ].sort((a, b) => {
                let ret = 0;
                if (sortBy.column === 'date') {
                    ret = a.created < b.created ? -1 : a.created > b.created ? 1 : 0;
                } else if (sortBy.column === 'system') {
                    ret = a.hostName < b.hostName ? -1 : a.hostName > b.hostName ? 1 : 0;
                }

                if (sortBy.direction === Direction.DESCENDING) {
                    ret *= -1;
                }

                return ret;
            });
        }

        const filters = page.filter;
        if (filters) {
            for (const filter of filters.elements) {
                if (filter.column === 'system') {
                    processedTriggers = processedTriggers.filter(t => t.hostName.toLowerCase().includes(filter.value));
                } else {
                    throw new Error(`Invalid filter ${filter.column}`);
                }
            }
        }

        setCount(processedTriggers.length);
        processedTriggers = processedTriggers.slice(page.start(), page.end());
        setPagedTriggers(processedTriggers);
    }, [ setPagedTriggers, page ]);

    React.useEffect(() => {
        updateTriggers(triggers || []);
    }, [ updateTriggers, triggers, page ]);

    return {
        count,
        pagedTriggers
    };
};
