import { act as actReact } from '@testing-library/react';
import { act as actHooks } from '@testing-library/react-hooks';

export const waitForAsyncEvents = async () => {
    await actReact(async () => {

    });
};

export const waitForAsyncEventsHooks = async () => {
    await actHooks(async () => {

    });
};
