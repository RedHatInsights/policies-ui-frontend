import { ErrorContentProps } from '../../components/Policy/Table/PolicyTable';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { GlobalDangerColor200 } from '../../utils/PFColors';

const noPermissionProps = {
    icon: ExclamationCircleIcon,
    iconColor: GlobalDangerColor200,
    title: 'No permission to view this page',
    content: 'You do not have permission to view this page'
};

export type Handlers = {
    clearAllFiltersAndTryAgain: () => void;
    refreshPage: () => void;
    tryAgain: () => void;
};

export const policyTableError = (
    canReadAll: boolean,
    handlers: Handlers,
    requestHasError?: boolean,
    httpCode?: number
): ErrorContentProps | undefined => {
    if (!canReadAll) {
        return noPermissionProps;
    }

    if (requestHasError) {
        switch (httpCode) {
            case 404:
                return {
                    icon: ExclamationCircleIcon,
                    iconColor: GlobalDangerColor200,
                    title: 'Not found',
                    content: 'The request did not provide any results, try to remove some filters and try again',
                    action: handlers.clearAllFiltersAndTryAgain,
                    actionLabel: 'Clear all filters'
                };
            case 401:
                return {
                    icon: ExclamationCircleIcon,
                    iconColor: GlobalDangerColor200,
                    title: 'Refresh your browser',
                    content: 'Your session expired while using the application',
                    action: handlers.refreshPage,
                    actionLabel: 'Reload page'
                };
            case 403:
                return noPermissionProps;
            case 500:
                return {
                    icon: ExclamationCircleIcon,
                    iconColor: GlobalDangerColor200,
                    title: 'Internal server error',
                    content: 'The server was unable to process the request, please try again.',
                    action: handlers.tryAgain,
                    actionLabel: 'Try again'
                };
            default:
                return {
                    icon: ExclamationCircleIcon,
                    iconColor: GlobalDangerColor200,
                    title: 'Unable to connect',
                    content: 'There was an error retrieving data. Check your connection and try again.',
                    action: handlers.tryAgain,
                    actionLabel: 'Try again'
                };
        }
    }

    return undefined;
};
