import { permissionLevel } from '../src/permissionLevel';

describe('permissionLevel test', function () {
  it('valid permission should be the correct level', () => {
    const validPermissions = ['none', 'read', 'write', 'admin'];
    for (let i = 0; i < validPermissions.length; i++) {
      expect(permissionLevel(validPermissions[i])).toEqual(i);
    }
  });

  it('not valid permission should be sanitized to `admin` level', () => {
    const notValidPermissions = ['', 'foo'];
    const adminPermissionLevel = permissionLevel('admin');
    for (const notValidPermission of notValidPermissions) {
      expect(permissionLevel(notValidPermission)).toEqual(adminPermissionLevel);
    }
  });
});
