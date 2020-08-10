import { renderHook } from '@testing-library/react-hooks';
import fetchMock from 'fetch-mock';
import { useFacts } from '../useFacts';
import { waitForAsyncEventsHooks } from '../../../test/TestUtils';
import { AppWrapper, appWrapperCleanup, appWrapperSetup } from '../../../test/AppWrapper';

describe('src/hooks/useFacts', () => {

    beforeEach(() => {
        appWrapperSetup();
    });

    afterEach(() => {
        appWrapperCleanup();
    });

    it('Facts are undefined when loading', async () => {
        fetchMock.getOnce('/api/policies/v1.0/facts', new Promise((() => {})));

        const { result } = renderHook(() => useFacts(), {
            wrapper: AppWrapper
        });

        await waitForAsyncEventsHooks();
        expect(result.current).toBeUndefined();
    });

    it('Facts are picked from the rest call', async () => {
        fetchMock.getOnce('/api/policies/v1.0/facts', {
            status: 200,
            body: [
            ]
        });

        const { result } = renderHook(() => useFacts(), {
            wrapper: AppWrapper
        });

        await waitForAsyncEventsHooks();
        expect(result.current).toEqual([]);
    });
});
