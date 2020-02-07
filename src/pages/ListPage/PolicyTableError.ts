import { ErrorContentProps } from '../../components/Policy/Table/PolicyTable';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const noPermissionProps = {
    icon: ExclamationCircleIcon,
    title: 'No permission to view this page',
    content: 'You do not have permission to view this page'
};

export const policyTableError = (canReadAll: boolean, requestHasError?: boolean, httpCode?: number): ErrorContentProps | undefined => {
    if (!canReadAll) {
        return noPermissionProps;
    }

    if (requestHasError) {
        switch (httpCode) {
            case 404:
                return {
                    icon: ExclamationCircleIcon,
                    title: 'Not found',
                    content: 'The request did not provide any results, try to remove some filters and try again'
                };
            case 401:
                return {
                    icon: ExclamationCircleIcon,
                    title: 'Refresh your brower',
                    content: 'Your session expired while using the application, Refresh your browser and try again'
                };
            case 403:
                return noPermissionProps;
            case 500:
                return {
                    icon: ExclamationCircleIcon,
                    title: 'Internal server error',
                    content: 'The server was unable to process the request, please try again.'
                };
            default:
                return {
                    icon: ExclamationCircleIcon,
                    title: 'Unable to connect',
                    content: 'There was an error retrieving data. Check your connection and try again.'
                };
        }
    }

    return undefined;
};
