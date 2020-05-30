import { useEffect } from 'react';

type AsyncFunction = () => (Promise<unknown> | unknown);

export const useSyncInterval = (ms: number, callback: AsyncFunction, callImmediately = false) => {
    useEffect(() => {
        let handler;
        let destructorCalled = false;
        const repeatLoop = async () => {
            const response = callback();
            if (response && (response as any).then) {
                await response;
            }

            if (!destructorCalled) {
                handler = setTimeout(repeatLoop, ms);
            }
        };

        if (callImmediately) {
            repeatLoop();
        } else {
            handler = setTimeout(repeatLoop, ms);
        }

        return () => {
            destructorCalled = true;
            clearTimeout(handler);
        };
    }, [ ms, callback, callImmediately ]);
};
