import {
    fromServerActions,
    makeCopyOfPolicy,
    toPolicies,
    toPolicy,
    toServerAction,
    toServerPolicy
} from './PolicyAdapter';
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
            id: '5151-5151',
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'email;webhook http://google.com',
            mtime: '2014-01-01T23:28:56.782Z'
        };
        const policy: Policy = {
            id: '5151-5151',
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.EMAIL
                },
                {
                    type: ActionType.WEBHOOK,
                    endpoint: 'http://google.com'
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z')
        };

        expect(toPolicy(sp)).toEqual(policy);
    });

    it('toPolicy fails if actions are wrong', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-456',
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'ABC',
            mtime: '2014-01-01T23:28:56.782Z'
        };
        expect(() => toPolicy(sp)).toThrowError();
    });

    it('toPolicies converts a PagedServerPolicy[] to Policy[]', () => {
        const sp1: ServerPolicyResponse = {
            id: '1234-1234',
            customerid: '5678',
            name: 'my name',
            description: 'my description',
            isEnabled: false,
            conditions: 'yyy',
            actions: 'email',
            mtime: '2010-01-01T23:28:56.782Z'
        };
        const sp2: ServerPolicyResponse = {
            id: '5151-5151',
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'webhook http://google.com',
            mtime: '2014-01-01T23:28:56.782Z'
        };

        const pagedResponse: PagedServerPolicyResponse = {
            data: [ sp1, sp2 ],
            links: 'foo',
            meta: 'bar'
        };

        const policy1: Policy = {
            id: '1234-1234',
            customerid: '5678',
            name: 'my name',
            description: 'my description',
            isEnabled: false,
            conditions: 'yyy',
            actions: [
                {
                    type: ActionType.EMAIL
                }
            ],
            mtime: new Date('2010-01-01T23:28:56.782Z')
        };

        const policy2: Policy = {
            id: '5151-5151',
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.WEBHOOK,
                    endpoint: 'http://google.com'
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z')
        };

        expect(toPolicies(pagedResponse)).toEqual([ policy1, policy2 ]);
    });

    it('toServerPolicy converts a DeepPartial< Policy > to ServerPolicyRequest', () => {
        const partialPolicy: DeepPartial<Policy> = {
            id: '5151-5151',
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }],
            mtime: new Date('2014-01-01T23:28:56.782Z')
        };
        const pr: ServerPolicyRequest = {
            id: '5151-5151',
            actions: 'email',
            conditions: '1 == 2',
            customerid: '1337',
            description: 'foo description',
            isEnabled: true,
            mtime: '2014-01-01T23:28:56.782Z',
            name: 'foo policy'
        };
        expect(toServerPolicy(partialPolicy)).toEqual(pr);
    });

    it('toServerPolicy does not fail with empty object', () => {
        const partialPolicy: DeepPartial<Policy> = { };
        const pr: ServerPolicyRequest = {
            actions: '',
            isEnabled: false,
            mtime: undefined
        };
        expect(toServerPolicy(partialPolicy)).toEqual(pr);
    });

    it('makeCopyOfPolicy makes a NewPolicy out of a Policy', () => {
        const policy: Policy = {
            id: '5151-5151',
            customerid: '1337',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK, endpoint: 'http://google.com' }],
            mtime: new Date('2014-01-01T23:28:56.782Z')
        };

        const newPolicy: NewPolicy = {
            id: undefined,
            customerid: undefined,
            mtime: undefined,
            name: 'Copy of foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK, endpoint: 'http://google.com' }]
        };
        expect(makeCopyOfPolicy(policy)).toEqual(newPolicy);
    });

    it('fromServerActions fails with wrong action', () => {
        const actions = 'email;1337:email';
        expect(() => fromServerActions(actions)).toThrowError();
    });

    it('fromServerActions parses the actions action', () => {
        const actions = 'email;email;webhook abc';
        expect(fromServerActions(actions)).toEqual([
            {
                type: ActionType.EMAIL
            },
            {
                type: ActionType.EMAIL
            },
            {
                type: ActionType.WEBHOOK,
                endpoint: 'abc'
            }
        ]);
    });

    it('toServerActions serializes the actions', () => {
        expect(toServerAction([
            {
                type: ActionType.EMAIL
            },
            {
                type: ActionType.WEBHOOK,
                endpoint: 'asdfgh'
            },
            {
                type: ActionType.EMAIL
            }
        ])).toEqual('email;webhook asdfgh;email');
    });
});
