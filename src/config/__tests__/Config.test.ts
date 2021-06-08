import { localUrl } from '@redhat-cloud-services/insights-common-typescript';

import { withBaseUrl } from '../Config';

describe('src/config/Config', () => {

    it('withBaseUrl appends the baseUrl to the passed path', () => {
        expect(withBaseUrl('/foo/bar')).toBe('/api/policies/v1.0/foo/bar');
    });

    it('localUrl does prepend beta to path if running on beta', () => {
        expect(localUrl('/foo/bar', true)).toBe('/beta/foo/bar');
    });

    it('localUrl does not prepend beta to path when not in beta', () => {
        expect(localUrl('/baz/bar', false)).toBe('/baz/bar');
    });
});
