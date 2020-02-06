import * as React from 'react';
import { Rbac } from '../types/Rbac';

export const RbacContext = React.createContext<Rbac>({
    canReadAll: false,
    canWriteAll: false
});
