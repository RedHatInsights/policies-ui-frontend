import { localUrl, withBaseUrl } from '../Config';

describe('src/config/Config', () => {

    const mockInsightsIsBeta = (isBeta: boolean) => {
        (global as any).insights = {
            chrome: {
                isBeta: jest.fn(() => isBeta)
            }
        };
    };

    beforeEach(() => {
        (global as any).insights = undefined;
    });

    it('withBaseUrl appends the baseUrl to the passed path', () => {
        expect(withBaseUrl('/foo/bar')).toBe('/api/policies/v1.0/foo/bar');
    });

    it('localUrl does prepend beta to path if running on beta', () => {
        mockInsightsIsBeta(true);
        expect(localUrl('/foo/bar')).toBe('/beta/foo/bar');
    });

    it('localUrl does not prepend beta to path when not in beta ', () => {
        mockInsightsIsBeta(false);
        expect(localUrl('/baz/bar')).toBe('/baz/bar');
    });
});
