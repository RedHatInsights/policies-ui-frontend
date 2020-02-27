import { AccessApi, AccessPagination } from '@redhat-cloud-services/rbac-client';
import axios from 'axios';
import { Rbac } from '../types/Rbac';
import Config from '../config/Config';

const BASE_PATH = '/api/rbac/v1';

export class RawRbac {
    readonly accessPagination: AccessPagination;

    constructor(accessPagination: AccessPagination) {
        this.accessPagination = accessPagination;
    }

    canRead(path: string): boolean {
        return this.findPermission(path, 'read');
    }

    canWrite(path: string): boolean {
        return this.findPermission(path, 'write');
    }

    canReadAll(): boolean {
        return this.canRead('*');
    }

    canWriteAll(): boolean {
        return this.canWrite('*');
    }

    private findPermission(path: string, what: string): boolean {
        if (!this.accessPagination?.data || this.accessPagination.data.length === 0) {
            return false;
        }

        for (const access of this.accessPagination.data) {
            const fields = access.permission.split(':');
            if (fields[1] === path) {
                if (fields[2] === what || fields[2] === '*') {
                    return true;
                }
            }
        }

        return false;
    }
}

export const fetchRBAC = (): Promise<Rbac> => {
    const instance = axios.create();

    return new AccessApi(undefined, BASE_PATH, instance)
    .getPrincipalAccess(Config.appId)
    .then(response => new RawRbac(response.data))
    .then(rawRbac => ({
        canReadAll: rawRbac.canReadAll(),
        canWriteAll: rawRbac.canWriteAll()
    }));
};
