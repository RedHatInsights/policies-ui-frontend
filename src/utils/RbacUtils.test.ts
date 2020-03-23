import { RawRbac } from './RbacUtils';
import { Access } from '@redhat-cloud-services/rbac-client';

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

    it('RawRbac detects no access', () => {
        const noAccess: Access[] = [];

        const rbac = new RawRbac({
            data: noAccess
        });

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
});
