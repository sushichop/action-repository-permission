const permissionLevel = (permission: string): number => {
  switch (permission) {
    case 'none':
      return 0;
    case 'read':
      return 1;
    case 'write':
      return 2;
    case 'admin':
      return 3;
    default:
      return 3;
  }
};

export { permissionLevel };
