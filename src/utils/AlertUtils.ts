import { addNotification as createNotificationAction } from '@redhat-cloud-services/frontend-components-notifications';
import { getStore } from '../store';

export enum NotificationType {
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
    INFO = 'info',
    DEFAULT = 'default'
}

export const addNotification = (type: NotificationType, title: string, description: string) => {
    getStore().dispatch(createNotificationAction({
        variant: type,
        title,
        description
    }));
};

export const addSuccessNotification = (title: string, description: string) => {
    addNotification(NotificationType.SUCCESS, title, description);
};

export const addDangerNotification = (title: string, description: string) => {
    addNotification(NotificationType.DANGER, title, description);
};
