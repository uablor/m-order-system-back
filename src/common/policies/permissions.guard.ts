import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, RequirePermissionsOptions } from '../decorators/require-permissions.decorator';
import { CurrentUserPayload } from '../decorators/current-user.decorator';
import { PATH_METADATA } from '@nestjs/common/constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ดึง permissions ที่ต้องการจาก decorator
    const requiredPermissions = this.reflector.getAllAndOverride<RequirePermissionsOptions>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // ถ้าไม่มีการกำหนด permissions ให้ผ่านไปได้
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as CurrentUserPayload | undefined;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // ถ้ามีการกำหนด permissions แบบ manual
    if (requiredPermissions.permissions && requiredPermissions.permissions.length > 0) {
      return this.checkManualPermissions(user, requiredPermissions.permissions);
    }

    // ถ้าเป็น auto permission (จาก controller path และ method name)
    if (requiredPermissions.auto) {
      return this.checkAutoPermission(context, user);
    }

    return true;
  }

  private checkManualPermissions(user: CurrentUserPayload, permissions: string[]): boolean {
    const userPermissions = user.permissions || [];
    
    const hasAllPermissions = permissions.every(permission => 
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Required permissions: ${permissions.join(', ')}. User permissions: ${userPermissions.join(', ') || 'none'}`
      );
    }

    return true;
  }

  private checkAutoPermission(context: ExecutionContext, user: CurrentUserPayload): boolean {
    const controller = context.getClass();
    const handler = context.getHandler();
    
    // ดึง controller path
    const controllerPath = this.getControllerPath(controller);
    if (!controllerPath) {
      return true; // ถ้าไม่มี path ให้ผ่านไป
    }

    // ดึง method name
    const methodName = handler.name;
    
    // สร้าง permission code แบบ auto: {controllerPath}:{methodName}
    const permissionCode = `${controllerPath}:${methodName}`;
    
    const userPermissions = user.permissions || [];
    const hasPermission = userPermissions.includes(permissionCode);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Required permission: ${permissionCode}. User permissions: ${userPermissions.join(', ') || 'none'}`
      );
    }

    return true;
  }

  private getControllerPath(controllerClass: any): string | null {
    const path = Reflect.getMetadata(PATH_METADATA, controllerClass);
    if (path == null || path === '') return null;
    return String(path).replace(/^\//, '').toLowerCase();
  }
}
