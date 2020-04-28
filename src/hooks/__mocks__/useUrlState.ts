import { useState } from 'react';

export const useUrlState = <T>(name: string, serializer: unknown, deserializer: unknown, defaultValue: T) => {
    return useState<T>(defaultValue);
};

export const useUrlStateString = (name: string, defaultValue: string) => {
    return useState<string>(defaultValue);
};
