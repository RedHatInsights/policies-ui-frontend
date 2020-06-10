import { client } from '../FetchingConfiguration';
import fetchMock from 'fetch-mock';
import { getInsights } from '../../utils/Insights';

jest.mock('../../utils/Insights');

describe('src/app/FetchingConfiguration', () => {
    it('Configures to get the user on every request', async () => {
        fetchMock.get('/foo', {
            status: 200
        });

        expect(getInsights().chrome.auth.getUser).toHaveBeenCalledTimes(0);

        const response = await client.query({
            endpoint: '/foo',
            method: 'GET'
        });

        expect(response.status).toBe(200);
        expect(getInsights().chrome.auth.getUser).toHaveBeenCalledTimes(1);
    });
});
