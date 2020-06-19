import { client } from '../FetchingConfiguration';
import fetchMock from 'fetch-mock';

describe('src/app/FetchingConfiguration', () => {

    it('Configures to get the user on every request', async () => {
        (global as any).insights = {
            chrome: {
                auth: {
                    getUser: jest.fn(() => Promise.resolve())
                }
            }
        };
        fetchMock.get('/foo', {
            status: 200
        });
        expect((global as any).insights.chrome.auth.getUser).toHaveBeenCalledTimes(0);

        const response = await client.query({
            endpoint: '/foo',
            method: 'GET'
        });

        expect(response.status).toBe(200);
        expect((global as any).insights.chrome.auth.getUser).toHaveBeenCalledTimes(1);
    });
});
