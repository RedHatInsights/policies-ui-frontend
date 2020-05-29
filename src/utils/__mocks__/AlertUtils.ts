const realAlertUtils = jest.requireActual('../AlertUtils');
const alertUtils: any = jest.genMockFromModule('../AlertUtils');

alertUtils.addNotification = jest.fn();

alertUtils.addSuccessNotification = jest.fn((title: string, description: string) => {
    alertUtils.addNotification(realAlertUtils.NotificationType.SUCCESS, title, description);
});

alertUtils.addDangerNotification = jest.fn((title: string, description: string) => {
    alertUtils.addNotification(realAlertUtils.NotificationType.DANGER, title, description);
});

module.exports = alertUtils;
