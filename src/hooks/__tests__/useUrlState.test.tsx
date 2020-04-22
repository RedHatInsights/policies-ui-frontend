import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useUrlState, UseUrlStateType, useUrlStateString, UseUrlStateStringType } from '../useUrlState';
import { MemoryRouter, useLocation } from 'react-router';

const getWrapper = (path?: string): React.FunctionComponent => {
    const Wrapper = (props) => (
        <MemoryRouter initialEntries={ path ? [ path ] : undefined } > { props.children } </MemoryRouter>
    );
    return Wrapper;
};

describe('src/hooks/useUrlState', () => {

    interface MyObject {
        val: string;
        val2: number;
    }

    const serializer = (val: MyObject) => `${val.val}_${val.val2}`;
    const deserializer = (val: string) => ({ val: val.split('_')[0], val2: +val.split('_')[1] });

    it('preamble tests to serializer & deserializers used for testing', () => {
        expect(serializer({
            val: 'foo bar',
            val2: 5
        })).toEqual('foo bar_5');

        expect(deserializer('yada_1234')).toEqual({
            val: 'yada',
            val2: 1234
        });
        expect(serializer(deserializer('roundtrip_112233'))).toEqual('roundtrip_112233');
    });

    it('should have an initial value', () => {
        const { result } = renderHook(
            (args: Parameters<UseUrlStateType<MyObject>>) => useUrlState<MyObject>(...args), {
                initialProps: [ 'my-param', serializer, deserializer, { val: 'hello', val2: 5 }],
                wrapper: getWrapper()
            }
        );

        const [ state ] = result.current;
        expect(state).toEqual({
            val: 'hello',
            val2: 5
        });
    });

    it('location has the initial value', () => {
        const { result } = renderHook(
            (args: Parameters<UseUrlStateType<MyObject>>) => ({
                urlState: useUrlState<MyObject>(...args),
                location: useLocation()
            }), {
                initialProps: [ 'my-param', serializer, deserializer, { val: 'hello', val2: 5 }],
                wrapper: getWrapper()
            }
        );

        const { search } = result.current.location;
        expect(search).toEqual('?my-param=hello_5');
    });

    it('should change value and location on setState', () => {
        const { result } = renderHook(
            (args: Parameters<UseUrlStateType<MyObject>>) => ({
                urlState: useUrlState<MyObject>(...args),
                location: useLocation()
            }), {
                initialProps: [ 'my-param', serializer, deserializer, { val: 'hello', val2: 5 }],
                wrapper: getWrapper()
            }
        );

        act(() => {
            const [ , setState ] = result.current.urlState;
            setState({
                val: 'here comes 1234',
                val2: 1234
            });
        });

        const { search } = result.current.location;
        const [ state ] = result.current.urlState;
        expect(search).toEqual('?my-param=here+comes+1234_1234');
        expect(state).toEqual({
            val: 'here comes 1234',
            val2: 1234
        });
    });

    it('use url value', () => {
        const { result } = renderHook(
            (args: Parameters<UseUrlStateType<MyObject>>) => ({
                urlState: useUrlState<MyObject>(...args),
                location: useLocation()
            }), {
                initialProps: [ 'my-param', serializer, deserializer, { val: 'hello', val2: 5 }],
                wrapper: getWrapper('http://localhost?my-param=serialized_3')
            }
        );

        const { search } = result.current.location;
        const [ state ] = result.current.urlState;
        expect(search).toEqual('?my-param=serialized_3');
        expect(state).toEqual({
            val: 'serialized',
            val2: 3
        });
    });

    it('param is removed from url on undefined', () => {
        const { result } = renderHook(
            (args: Parameters<UseUrlStateType<MyObject>>) => ({
                urlState: useUrlState<MyObject>(...args),
                location: useLocation()
            }), {
                initialProps: [ 'my-param', serializer, deserializer, { val: 'hello', val2: 5 }],
                wrapper: getWrapper('http://localhost?my-param=serialized_3')
            }
        );

        act(() => {
            const [ , setState ] = result.current.urlState;
            setState(undefined);
        });

        const { search } = result.current.location;
        const [ state ] = result.current.urlState;
        expect(search).toEqual('?');
        expect(state).toEqual(undefined);
    });

    it('allows a function in setter', () => {
        const { result } = renderHook(
            (args: Parameters<UseUrlStateType<MyObject>>) => ({
                urlState: useUrlState<MyObject>(...args),
                location: useLocation()
            }), {
                initialProps: [ 'my-param', serializer, deserializer, { val: 'hello', val2: 5 }],
                wrapper: getWrapper()
            }
        );

        act(() => {
            const [ , setState ] = result.current.urlState;
            setState(prev => {
                return {
                    val: 'here comes 1234',
                    val2: prev?.val2 || 180
                };
            });
        });

        const { search } = result.current.location;
        const [ state ] = result.current.urlState;
        expect(search).toEqual('?my-param=here+comes+1234_5');
        expect(state).toEqual({
            val: 'here comes 1234',
            val2: 5
        });
    });

    describe('useUrlStateString', () => {
        it('should have an initial value', () => {

            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => useUrlStateString(...args), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper()
                }
            );

            const [ state ] = result.current;
            expect(state).toEqual('init-value');
        });

        it('should allow to set values', () => {
            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => useUrlStateString(...args), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper()
                }
            );

            {
                const [ state ] = result.current;
                expect(state).toEqual('init-value');
            }

            act(() => {
                const [ , setState ] = result.current;
                setState('hello world');
            });
            {
                const [ state ] = result.current;
                expect(state).toEqual('hello world');
            }
        });

        it('when a value is set, it updates the search', () => {
            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => ({
                    urlStateString: useUrlStateString(...args),
                    location: useLocation()
                }), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper()
                }
            );
            {
                const [ state ] = result.current.urlStateString;
                expect(state).toEqual('init-value');
            }

            act(() => {
                const [ , setState ] = result.current.urlStateString;
                setState('hello world');
            });

            {
                const { search } = result.current.location;
                expect(search).toEqual('?my-param=hello+world');
            }
        });

        it('param is set to initialValue on both value and url', () => {
            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => ({
                    urlStateString: useUrlStateString(...args),
                    location: useLocation()
                }), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper()
                }
            );
            {
                const [ state ] = result.current.urlStateString;
                expect(state).toEqual('init-value');
            }

            {
                const { search } = result.current.location;
                expect(search).toEqual('?my-param=init-value');
            }
        });

        it('state can be undefined', () => {
            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => useUrlStateString(...args), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper()
                }
            );
            {
                const [ state ] = result.current;
                expect(state).toEqual('init-value');
            }

            act(() => {
                const [ , setState ] = result.current;
                setState(undefined);
            });

            {
                const [ state ] = result.current;
                expect(state).toEqual(undefined);
            }
        });

        it('param is removed on empty string', () => {
            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => ({
                    urlStateString: useUrlStateString(...args),
                    location: useLocation()
                }), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper()
                }
            );
            {
                const [ state ] = result.current.urlStateString;
                expect(state).toEqual('init-value');
            }

            act(() => {
                const [ , setState ] = result.current.urlStateString;
                setState('');
            });

            {
                const { search } = result.current.location;
                expect(search).toEqual('?');
            }
        });

        it('location does not change when setting the same value again', () => {
            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => ({
                    urlStateString: useUrlStateString(...args),
                    location: useLocation()
                }), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper()
                }
            );
            {
                const [ state ] = result.current.urlStateString;
                expect(state).toEqual('init-value');
            }

            act(() => {
                const [ , setState ] = result.current.urlStateString;
                setState('1 2 3');
            });

            const prevLocation = result.current.location;

            act(() => {
                const [ , setState ] = result.current.urlStateString;
                setState('1 2 3');
            });

            expect(result.current.location).toEqual(prevLocation);
        });

        it('loads value from url', () => {
            const { result } = renderHook(
                (args: Parameters<UseUrlStateStringType>) => ({
                    urlStateString: useUrlStateString(...args),
                    location: useLocation()
                }), {
                    initialProps: [ 'my-param', 'init-value' ],
                    wrapper: getWrapper('http://localhost?my-param=foo-bar')
                }
            );

            expect(result.current.urlStateString[0]).toEqual('foo-bar');
            expect(result.current.location.search).toEqual('?my-param=foo-bar');
        });
    });
});
