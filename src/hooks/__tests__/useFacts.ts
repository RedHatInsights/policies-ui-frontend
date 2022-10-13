import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { AppWrapper, appWrapperCleanup, appWrapperSetup } from '../../../test/AppWrapper';
import { useFacts } from '../useFacts';

describe('src/hooks/useFacts', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Facts are undefined when loading', async () => {
        const mockAdapter = new MockAdapter(axios);
        mockAdapter.onGet('/api/policies/v1.0/facts').replyOnce(() => new Promise((jest.fn())));

        const { result, waitFor } = renderHook(() => useFacts(), {
            wrapper: AppWrapper
        });

        await waitFor(() => result.current === undefined);
        expect(result.current).toBeUndefined();
    });

    it('Facts are picked from the rest call', async () => {
        const mockAdapter = new MockAdapter(axios);
        mockAdapter.onGet('/api/policies/v1.0/facts').reply(200, []);

        const { result, waitFor } = renderHook(() => useFacts(), {
            wrapper: AppWrapper
        });

        await waitFor(() => !!result.current);
        expect(result.current).toEqual([]);
    });
});
