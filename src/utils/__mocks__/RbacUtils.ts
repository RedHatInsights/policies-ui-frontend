const rbac: any = jest.genMockFromModule('../RbacUtils');

rbac.fetchRBAC = jest.fn(() => (Promise.resolve({
    canReadAll: true,
    canWriteAll: true
})));

module.exports = rbac;
