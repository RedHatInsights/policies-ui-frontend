import { dirname } from 'path';

export const autoHookMock = (modulePath: string) => {
    if (module?.parent?.filename) {
        modulePath = dirname(module?.parent?.filename) + '/' + modulePath;
    }

    const actual = jest.requireActual(modulePath);
    const mockedModule = jest.requireMock(modulePath);

    for (const key in actual) {
        if (typeof actual[key] === 'function') {
            const hook = actual[key];
            const mocked = mockedModule[key];
            mocked.mockImplementation((args: any) => {
                const value = hook(args);
                const properties = Object.keys(value);
                for (const property of properties) {
                    const real = value[property];
                    if (typeof real !== 'function') {
                        continue;
                    }

                    if (!real.__mock) {
                        real.__mock = jest.fn(real as unknown as () => unknown);
                    }

                    value[property] = real.__mock;
                }

                return value;
            });
            actual[key] = mocked;
        }
    }

    return actual;
};
