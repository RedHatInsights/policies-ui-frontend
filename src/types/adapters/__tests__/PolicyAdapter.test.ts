import { DeepPartial } from 'ts-essentials';

import { ActionType } from '../../Policy/Actions';
import {
    NewPolicy,
    PagedServerPolicyResponse,
    Policy,
    ServerPolicyRequest,
    ServerPolicyResponse
} from '../../Policy/Policy';
import {
    fromServerActions,
    makeCopyOfPolicy,
    toPolicies,
    toPolicy,
    toServerAction,
    toServerPolicy
} from '../PolicyAdapter';

describe('src/utils/PolicyAdapter', () => {
    it('toPolicy converts ServerPolicyResponse to Policy', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'notification',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 77897987000
        };
        const policy: Policy = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.NOTIFICATION
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastTriggered: new Date('1972-06-20T14:19:47.000Z')
        };

        expect(toPolicy(sp)).toEqual(policy);
    });

    it('toPolicy silently ignores webhook and email', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'email;notification;webhook',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 77897987000
        };
        const policy: Policy = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.NOTIFICATION
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
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

    it('toPolicy parses 0 lastTriggered as undefined', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'notification',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
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
                    type: ActionType.NOTIFICATION
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastTriggered: undefined
        };

        expect(toPolicy(sp)).toEqual(policy);
    });

    it('parses lastTriggered correctly', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'notification',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 1589912060644
        };
        const policy: Policy = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [
                {
                    type: ActionType.NOTIFICATION
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastTriggered: new Date('2020-05-19T18:14:20.000Z')
        };

        expect(toPolicy(sp)).toEqual(policy);
    });

    it('toPolicy policies without id to empty string', () => {
        const sp: ServerPolicyResponse = {
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: '',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 0
        };

        expect(toPolicy(sp).id).toEqual('');
    });

    it('toPolicy policies without description to empty string', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            isEnabled: true,
            conditions: '1 == 2',
            actions: '',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 0
        };

        expect(toPolicy(sp).description).toEqual('');
    });

    it('toPolicy policies without isEnabled to false', () => {
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            conditions: '1 == 2',
            actions: '',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 0
        };

        expect(toPolicy(sp).isEnabled).toEqual(false);
    });

    it('toPolicy policies without mtime to current created', () => {
        const now = new Date().getTime();
        jest.spyOn(Date, 'now').mockImplementation(() => now);
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: '',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 0
        };

        expect(toPolicy(sp).mtime).toEqual(new Date(now));
    });

    it('toPolicy policies without ctime to current created', () => {
        const now = new Date().getTime();
        jest.spyOn(Date, 'now').mockImplementation(() => now);
        const sp: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: '',
            mtime: '2014-01-01T23:28:56.782Z',
            lastTriggered: 0
        };

        expect(toPolicy(sp).ctime).toEqual(new Date(now));
    });

    it('toPolicies converts a PagedServerPolicy with no data to []', () => {
        expect(toPolicies({} as PagedServerPolicyResponse)).toEqual([]);
    });

    it('toPolicies converts a PagedServerPolicy[] to Policy[]', () => {
        const sp1: ServerPolicyResponse = {
            id: '1234-1234',
            name: 'my name',
            description: 'my description',
            isEnabled: false,
            conditions: 'yyy',
            actions: 'notification',
            mtime: '2010-01-01T23:28:56.782Z',
            ctime: '2009-01-01T23:28:56.782Z',
            lastTriggered: undefined
        };
        const sp2: ServerPolicyResponse = {
            id: '5151-5151',
            name: 'foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: 'notification',
            mtime: '2014-01-01T23:28:56.782Z',
            ctime: '2013-01-01T23:28:56.782Z',
            lastTriggered: 458906840000
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
                    type: ActionType.NOTIFICATION
                }
            ],
            mtime: new Date('2010-01-01T23:28:56.782Z'),
            ctime: new Date('2009-01-01T23:28:56.782Z'),
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
                    type: ActionType.NOTIFICATION
                }
            ],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
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
            actions: [{ type: ActionType.NOTIFICATION }],
            mtime: new Date('2014-01-01T23:28:56.782Z')
        };
        const pr: ServerPolicyRequest = {
            id: '5151-5151',
            actions: 'notification',
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
            name: '',
            conditions: '',
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
            actions: [{ type: ActionType.NOTIFICATION }],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastTriggered: new Date('2015-01-01T23:28:56.782Z')
        };

        const newPolicy: NewPolicy = {
            id: undefined,
            mtime: undefined,
            name: 'Copy of foo policy',
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.NOTIFICATION }],
            ctime: undefined,
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
            actions: [{ type: ActionType.NOTIFICATION }],
            mtime: new Date('2014-01-01T23:28:56.782Z'),
            ctime: new Date('2013-01-01T23:28:56.782Z'),
            lastTriggered: new Date('2015-01-01T23:28:56.782Z')
        };

        const newPolicy: NewPolicy = {
            id: undefined,
            mtime: undefined,
            name: copyOfName,
            description: 'foo description',
            isEnabled: true,
            conditions: '1 == 2',
            actions: [{ type: ActionType.NOTIFICATION }],
            ctime: undefined,
            lastTriggered: undefined
        };
        expect(makeCopyOfPolicy(policy)).toEqual(newPolicy);
    });

    it('fromServerActions fails with wrong action', () => {
        const actions = 'notification;1337:notification';
        expect(() => fromServerActions(actions)).toThrowError();
    });

    it('fromServerActions does not fail with empty actions', () => {
        const actions = fromServerActions('notification;;    ;;;      ;;;;;');
        expect(actions.length).toEqual(1);
    });

    it('fromServerActions parses the actions action', () => {
        const actions = 'notification;notification;notification';
        expect(fromServerActions(actions)).toEqual([
            {
                type: ActionType.NOTIFICATION
            },
            {
                type: ActionType.NOTIFICATION
            },
            {
                type: ActionType.NOTIFICATION
            }
        ]);
    });

    it('fromServerActions returns empty array on undefined actions', () => {
        const actions = undefined;
        expect(fromServerActions(actions)).toEqual([]);
    });

    it('fromServerActions returns empty array on empty actions string', () => {
        const actions = '';
        expect(fromServerActions(actions)).toEqual([]);
    });

    it('toServerActions serializes the actions', () => {
        expect(toServerAction([
            {
                type: ActionType.NOTIFICATION
            },
            {
                type: ActionType.NOTIFICATION
            },
            {
                type: ActionType.NOTIFICATION
            }
        ])).toEqual('notification;notification;notification');
    });

    it('toServerActions yields empty string for unspecified action', () => {
        expect(toServerAction([ undefined ])).toEqual('');
    });

    it('toServerActions yields empty string for action without type', () => {
        expect(toServerAction([{
            type: undefined
        }])).toEqual('');
    });

    it('toServerActions throws with unknown type (at runtime)', () => {
        expect(() => toServerAction([{
            type: 'foobared' as ActionType
        }])).toThrowError();
    });
});
