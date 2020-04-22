export const assertNever = (value: never): never => {
    throw new Error(`Invalid value received [${value}]`);
};
