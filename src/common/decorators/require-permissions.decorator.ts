import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export interface RequirePermissionsOptions {
  permissions?: string[];
  auto?: boolean;
}

/**
 * กำหนด permissions ที่ต้องการสำหรับ method หรือ controller
 * 
 * การใช้งานแบบ manual:
 * @RequirePermissions(['users:create', 'users:edit'])
 * 
 * การใช้งานแบบ auto (จะ generate permission จาก controller path และ method name):
 * @RequirePermissions({ auto: true })
 */
export const RequirePermissions = (options: string[] | RequirePermissionsOptions) => {
  const normalizedOptions: RequirePermissionsOptions = Array.isArray(options)
    ? { permissions: options }
    : options;
    
  return SetMetadata(PERMISSIONS_KEY, normalizedOptions);
};

/**
 * Decorator สำหรับ auto permission แบบสั้นๆ
 * จะสร้าง permission จาก {controllerPath}:{methodName} อัตโนมัติ
 */
export const RequireAutoPermission = () => 
  RequirePermissions({ auto: true });
