import { actionCreator, dataToTriggers } from '../../../services/useGetPolicyTriggers';
import { Uuid } from '../../../types/Policy/Policy';
import { useCallback } from 'react';
import { useClient } from 'react-fetching-library';
import { Trigger } from '../../../types/Trigger';
import { Filter, Page } from '@redhat-cloud-services/insights-common-typescript';

// This is the maximum batch size supported by the backend
const BATCH_SIZE = 200;

export const useGetAllTriggers = (policyId: Uuid, filter: Filter | undefined) => {
    const client = useClient();

    const getAllTriggers = useCallback(() => {
        return new Promise<Array<Trigger>>(async (resolve) => {
            const triggers: Array<Trigger> = [];
            let page = Page.of(1, BATCH_SIZE, filter);
            while (true) {
                const response = (await client.query(actionCreator({
                    policyId,
                    page
                })));
                if (response.status !== 200) {
                    break;
                }

                const localTriggers = dataToTriggers(response.payload);
                if (localTriggers.data) {
                    triggers.push(...localTriggers.data);
                    page = page.nextPage();
                    if (page.index > Page.lastPageForElements(localTriggers.count, page.size).index) {
                        break;
                    }
                }
            }

            resolve(triggers);
        });
    }, [ client, policyId ]);

    return getAllTriggers;
};
