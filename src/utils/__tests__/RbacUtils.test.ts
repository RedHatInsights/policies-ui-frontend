import { fetchRBAC, RawRbac } from '../RbacUtils';
import axios from 'axios';
import { Access, AccessPagination } from '@redhat-cloud-services/rbac-client';
import MockAdapter from 'axios-mock-adapter';

describe('src/utils/RbacUtils', () => {
    it('RawRbac detects fullAccess', () => {
        const fullAccess: Access[] = [
            {
                permission: 'policies:*:*',
                resourceDefinitions: []
            }
        ];

        const rbac = new RawRbac({
            data: fullAccess
        });

        expect(rbac.canWriteAll()).toEqual(true);
        expect(rbac.canReadAll()).toEqual(true);
    });

    it('RawRbac detects no access when given other permissions', () => {
        const otherAccess: Access[] = [
            {
                permission: 'policies:foo:bar',
                resourceDefinitions: []
            }
        ];

        const rbac = new RawRbac({
            data: otherAccess
        });

        expect(rbac.canWriteAll()).toEqual(false);
        expect(rbac.canReadAll()).toEqual(false);
    });

    it('RawRbac detects no access', () => {
        const noAccess: Access[] = [];

        const rbac = new RawRbac({
            data: noAccess
        });

        expect(rbac.canWriteAll()).toEqual(false);
        expect(rbac.canReadAll()).toEqual(false);
    });

    it('RawRbac detects no access (undef data)', () => {
        const noAccess = undefined as unknown as Access[];

        const rbac = new RawRbac({
            data: noAccess
        });

        expect(rbac.canWriteAll()).toEqual(false);
        expect(rbac.canReadAll()).toEqual(false);
    });

    it('RawRbac detects no access (undef access)', () => {
        const rbac = new RawRbac(undefined as unknown as AccessPagination);

        expect(rbac.canWriteAll()).toEqual(false);
        expect(rbac.canReadAll()).toEqual(false);
    });

    it('RawRbac detects only read', () => {
        const readAccess: Access[] = [
            {
                permission: 'policies:*:read',
                resourceDefinitions: []
            }
        ];

        const rbac = new RawRbac({
            data: readAccess
        });

        expect(rbac.canWriteAll()).toEqual(false);
        expect(rbac.canReadAll()).toEqual(true);
    });

    it('RawRbac detects only write', () => {
        const writeAccess: Access[] = [
            {
                permission: 'policies:*:write',
                resourceDefinitions: []
            }
        ];

        const rbac = new RawRbac({
            data: writeAccess
        });

        expect(rbac.canWriteAll()).toEqual(true);
        expect(rbac.canReadAll()).toEqual(false);
    });

    it('fetchRBAC fetches the RBAC object', async () => {
        const mock = new MockAdapter(axios);
        mock.onGet('/api/rbac/v1/access/?application=policies').reply(200,
            {
                data: [
                    {
                        permission: 'policies:*:*',
                        resourceDefinitions: []
                    }
                ]
            }
        );

        const rbac = await fetchRBAC();
        expect(rbac).toEqual({
            canReadAll: true,
            canWriteAll: true
        });
        mock.restore();
    });
});
