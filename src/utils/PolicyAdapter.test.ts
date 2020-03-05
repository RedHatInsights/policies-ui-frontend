import { makeCopyOfPolicy, toPolicies, toPolicy, toServerPolicy } from './PolicyAdapter';
import {
    NewPolicy,
    PagedServerPolicyResponse,
    Policy,
    ServerPolicyRequest,
    ServerPolicyResponse
} from '../types/Policy/Policy';
import { DeepPartial } from 'ts-essentials';
import { ActionType } from '../types/Policy/Actions';

describe('src/utils/PolicyAdapter', () => {
    it('toPolicy converts ServerPolicyResponse to Policy', () => {
        const sp: ServerPolicyResponse = {
            id: 5151,
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'ABC',
            mtime: '2014-01-01T23:28:56.782Z',
            triggerId: 'my-trigger-id'
        };
        const policy: Policy = {
            id: 5151,
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            triggerId: 'my-trigger-id'
        };

        expect(toPolicy(sp)).toEqual(policy);
    });

    it('toPolicies converts a PagedServerPolicy[] to Policy[]', () => {
        const sp1: ServerPolicyResponse = {
            id: 1234,
            customerid: '5678',
            name: 'my name',
            description: 'my description',
            isEnabled: false,
            conditions: 'yyy',
            actions: 'my action',
            mtime: '2010-01-01T23:28:56.782Z',
            triggerId: 'asdfghjkl'
        };
        const sp2: ServerPolicyResponse = {
            id: 5151,
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'ABC',
            mtime: '2014-01-01T23:28:56.782Z',
            triggerId: 'my-trigger-id'
        };

        const pagedResponse: PagedServerPolicyResponse = {
            data: [ sp1, sp2 ],
            links: 'foo',
            meta: 'bar'
        };

        const policy1: Policy = {
            id: 1234,
            customerid: '5678',
            name: 'my name',
            description: 'my description',
            isEnabled: false,
            conditions: 'yyy',
            actions: [],
            mtime: new Date('2010-01-01T23:28:56.782Z'),
            triggerId: 'asdfghjkl'
        };

        const policy2: Policy = {
            id: 5151,
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            triggerId: 'my-trigger-id'
        };

        expect(toPolicies(pagedResponse)).toEqual([ policy1, policy2 ]);
    });

    it('toServerPolicy converts a DeepPartial< Policy > to ServerPolicyRequest', () => {
        const partialPolicy: DeepPartial<Policy> = {
            id: 5151,
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            triggerId: 'my-trigger-id'
        };
        const pr: ServerPolicyRequest = {
            id: 5151,
            actions: 'email',
            conditions: '1 == 2',
            customerid: '1337',
            description: 'foo description',
            isEnabled: true,
            mtime: '2014-01-01T23:28:56.782Z',
            name: 'foo policy',
            triggerId: 'my-trigger-id'
        };
        expect(toServerPolicy(partialPolicy)).toEqual(pr);
    });

    it('toServerPolicy does not fail with empty object', () => {
        const partialPolicy: DeepPartial<Policy> = { };
        const pr: ServerPolicyRequest = { };
        expect(toServerPolicy(partialPolicy)).toEqual(pr);
    });

    it('makeCopyOfPolicy makes a NewPolicy out of a Policy', () => {
        const policy: Policy = {
            id: 5151,
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK, endpoint: 'http://google.com' }],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            triggerId: 'my-trigger-id'
        };

        const newPolicy: NewPolicy = {
            id: undefined,
            customerid: undefined,
            triggerId: undefined,
            mtime: undefined,
            name: 'Copy of foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK, endpoint: 'http://google.com' }]
        };
        expect(makeCopyOfPolicy(policy)).toEqual(newPolicy);
    });
});
