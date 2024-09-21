import Store from '@/shared/store';

type roleData = {
  admin: boolean;
  ta: boolean;
  store: boolean;
  proteusDeveloper: boolean;
  teamName: string;
};

export const roles: Array<string> = Store.namespace('auth').get('roles') ?? [];

export const admin: boolean = roles.includes('admin');
export const ta: boolean = roles.includes('ta');
export const store: boolean = roles.includes('store');
export const student: boolean = roles.includes('student');
export const proteusDeveloper: boolean = roles.includes('proteusDeveloper');
export const teamName: string = Store.namespace('auth').get('teamName');

export const storeRoles = (data: roleData) => {
  const roles = [];

  if (data.admin) {
    roles.push('admin');
  }
  if (data.ta) {
    roles.push('ta');
  }
  if (data.store) {
    roles.push('store');
  }
  if (data.proteusDeveloper) {
    roles.push('proteusDeveloper');
  }
  if (roles.length === 0) {
    roles.push('student');
  }

  Store.namespace('auth').set('roles', roles);

  Store.namespace('auth').set('teamName', data.teamName);

  return roles;
};

export default {
  admin,
  ta,
  store,
  proteusDeveloper,
  student,
  teamName,
};
