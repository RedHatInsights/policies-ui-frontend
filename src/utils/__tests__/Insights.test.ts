import { waitForInsights } from '../Insights';

describe('src/utils/Insights', () => {
    it('should resolve once insights is set', async () => {
        jest.useFakeTimers();
        delete((global as any).insights);
        const insightPromise = waitForInsights();
        (global as any).insights = { chrome: { isProd: true }};
        jest.runAllTimers();
        return insightPromise.then(insights => {
            expect(insights.chrome.isProd).toEqual(true);
        });
    });
});
