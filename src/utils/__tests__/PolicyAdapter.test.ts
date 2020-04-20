import {
    fromServerActions,
    makeCopyOfPolicy,
    toPolicies,
    toPolicy,
    toServerAction,
    toServerPolicy
} from '../PolicyAdapter';
import {
    NewPolicy,
    PagedServerPolicyResponse,
    Policy,
    ServerPolicyRequest,
    ServerPolicyResponse
} from '../../types/Policy/Policy';
import { DeepPartial } from 'ts-essentials';
import { ActionType } from '../../types/Policy/Actions';

describe('src/utils/PolicyAdapter', () => {
    it('toPolicy converts ServerPolicyResponse to Policy', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'email;webhook',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastEvaluation: '2015-01-01T23:28:56.782Z',
            lastTriggered: 77897987
        };
        const policy: Policy = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.EMAIL
                },
                {
                    type: ActionType.WEBHOOK
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastEvaluation: new Date('2015-01-01T23:28:56.782Z'),
            lastTriggered: new Date('1972-06-20T14:19:47.000Z')
        };

        expect(toPolicy(sp)).toEqual(policy);
    });

    it('toPolicy fails if actions are wrong', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-456',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'ABC',
            mtime: '2014-01-01T23:28:56.782Z'
        };
        expect(() => toPolicy(sp)).toThrowError();
    });

    it('toPolicy parses empty lastTriggered as undefined', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'email;webhook',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastEvaluation: '',
            lastTriggered: 0
        };
        const policy: Policy = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.EMAIL
                },
                {
                    type: ActionType.WEBHOOK
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastEvaluation: undefined,
            lastTriggered: undefined
        };

        expect(toPolicy(sp)).toEqual(policy);
    });

    it('toPolicies converts a PagedServerPolicy[] to Policy[]', () => {
        const sp1: ServerPolicyResponse = {
            id: '1234-1234',
            name: 'my name',
            description: 'my description',
            isEnabled: false,
            conditions: 'yyy',
            actions: 'email',
            mtime: '2010-01-01T23:28:56.782Z',
            ctime: '2009-01-01T23:28:56.782Z',
            lastEvaluation: '2011-01-01T23:28:56.782Z',
            lastTriggered: undefined
        };
        const sp2: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'webhook',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastEvaluation: '2015-01-01T23:28:56.782Z',
            lastTriggered: 458906840
        };

        const pagedResponse: PagedServerPolicyResponse = {
            data: [ sp1, sp2 ],
            links: {},
            meta: {}
        };

        const policy1: Policy = {
            id: '1234-1234',
            name: 'my name',
            description: 'my description',
            isEnabled: false,
            conditions: 'yyy',
            actions: [
                {
                    type: ActionType.EMAIL
                }
            ],
            mtime: new Date('2010-01-01T23:28:56.782Z'),
            ctime: new Date('2009-01-01T23:28:56.782Z'),
            lastEvaluation: new Date('2011-01-01T23:28:56.782Z'),
            lastTriggered: undefined
        };

        const policy2: Policy = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.WEBHOOK
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastEvaluation: new Date('2015-01-01T23:28:56.782Z'),
            lastTriggered: new Date('1984-07-17T10:07:20.000Z')
        };

        expect(toPolicies(pagedResponse)).toEqual([ policy1, policy2 ]);
    });

    it('toServerPolicy converts a DeepPartial< Policy > to ServerPolicyRequest', () => {
        const partialPolicy: DeepPartial<Policy> = {
            id: '5151-5151',
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
            description: 'foo description',
            isEnabled: true,
            name: 'foo policy'
        };
        expect(toServerPolicy(partialPolicy)).toEqual(pr);
    });

    it('toServerPolicy does not fail with empty object', () => {
        const partialPolicy: DeepPartial<Policy> = { };
        const pr: ServerPolicyRequest = {
            actions: '',
            isEnabled: false
        };
        expect(toServerPolicy(partialPolicy)).toEqual(pr);
    });

    it('makeCopyOfPolicy makes a NewPolicy out of a Policy', () => {
        const policy: Policy = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK }],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastEvaluation: new Date('2015-01-01T23:28:56.782Z'),
            lastTriggered: new Date('2015-01-01T23:28:56.782Z')
        };

        const newPolicy: NewPolicy = {
            id: undefined,
            mtime: undefined,
            name: 'Copy of foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK }],
            ctime: undefined,
            lastEvaluation: undefined,
            lastTriggered: undefined
        };
        expect(makeCopyOfPolicy(policy)).toEqual(newPolicy);
    });

    it('makeCopyOfPolicy restricts the policy name to 150 characters', () => {
        const name = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula ' +
            'get dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis pa';
        const copyOfName = 'Copy of Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula ' +
            'get dolor. Aenean massa. Cum sociis natoque penatibus et magni';

        const policy: Policy = {
            id: '5151-5151',
            name,
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK }],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastEvaluation: new Date('2015-01-01T23:28:56.782Z')
        };

        const newPolicy: NewPolicy = {
            id: undefined,
            mtime: undefined,
            name: copyOfName,
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.EMAIL }, { type: ActionType.WEBHOOK }],
            ctime: undefined,
            lastEvaluation: undefined
        };
        expect(makeCopyOfPolicy(policy)).toEqual(newPolicy);
    });

    it('fromServerActions fails with wrong action', () => {
        const actions = 'email;1337:email';
        expect(() => fromServerActions(actions)).toThrowError();
    });

    it('fromServerActions parses the actions action', () => {
        const actions = 'email;email;webhook';
        expect(fromServerActions(actions)).toEqual([
            {
                type: ActionType.EMAIL
            },
            {
                type: ActionType.EMAIL
            },
            {
                type: ActionType.WEBHOOK
            }
        ]);
    });

    it('toServerActions serializes the actions', () => {
        expect(toServerAction([
            {
                type: ActionType.EMAIL
            },
            {
                type: ActionType.WEBHOOK
            },
            {
                type: ActionType.EMAIL
            }
        ])).toEqual('email;webhook;email');
    });
});
