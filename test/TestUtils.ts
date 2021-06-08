import { act as actReact } from '@testing-library/react';
import { act as actHooks } from '@testing-library/react-hooks/dom';

export const waitForAsyncEvents = async () => {
    await actReact(async () => {

    });
};

export const waitForAsyncEventsHooks = async () => {
    await actHooks(async () => {

    });
};
