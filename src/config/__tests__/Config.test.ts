import { localUrl } from '@redhat-cloud-services/insights-common-typescript';

import { withBaseUrl } from '../Config';

describe('src/config/Config', () => {

    it('withBaseUrl appends the baseUrl to the passed path', () => {
        expect(withBaseUrl('/foo/bar')).toBe('/api/policies/v1.0/foo/bar');
    });

    it('localUrl does prepend preview to path if running on beta', () => {
        expect(localUrl('/foo/bar', true)).toBe('/preview/foo/bar');
    });

    it('localUrl does not prepend preview to path when not in beta', () => {
        expect(localUrl('/baz/bar', false)).toBe('/baz/bar');
    });
});
