import * as React from 'react';

/*
 * A context to be used to pass stuff around. May later be replaced by a better
 * solution
 */

const CpContext = React.createContext({ username: '', accountNumber: '' });
CpContext.displayName = 'CPContext';

export const CpCxProvider = CpContext.Provider;
export const CpCxConsumer = CpContext.Consumer;
export default CpContext;
