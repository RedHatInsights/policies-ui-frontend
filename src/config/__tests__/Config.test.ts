import { withBaseUrl } from '../Config';

describe('src/config/Config', () => {
    it('withBaseUrl appends the baseUrl to the passed path', () => {
        expect(withBaseUrl('/foo/bar')).toBe('/api/policies/v1.0/foo/bar');
    });
});
