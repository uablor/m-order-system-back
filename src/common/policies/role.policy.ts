import { CurrentUserPayload } from '../decorators/current-user.decorator';

export const ADMIN_ROLE = 'ADMIN';

export function canCreateRole(user: CurrentUserPayload): boolean {
  return user?.roleName === ADMIN_ROLE;
}

export function canAssignPermission(user: CurrentUserPayload): boolean {
  return user?.roleName === ADMIN_ROLE;
}

export function canUpdateUser(user: CurrentUserPayload, targetUserId: string): boolean {
  return user?.roleName === ADMIN_ROLE || user?.userId === targetUserId;
}

export function canDeleteUser(user: CurrentUserPayload, targetUserId: string): boolean {
  return user?.roleName === ADMIN_ROLE || user?.userId === targetUserId;
}
