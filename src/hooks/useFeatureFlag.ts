import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

export const useFeatureFlag = (flag: string) => {
    const { flagsReady } = useFlagsStatus();
    const isFlagEnabled = useFlag(flag);
    return flagsReady ? isFlagEnabled : false;
};
