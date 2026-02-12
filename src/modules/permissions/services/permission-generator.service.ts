import { Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { PATH_METADATA } from '@nestjs/common/constants';
import { PermissionRepository } from '../repositories/permission.repository';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { SKIP_AUTO_PERMISSION_KEY } from '../../../common/decorators/skip-auto-permission.decorator';
import { GeneratePermissionsResult, GeneratedPermission } from '../interface/generted-permssion.interfacet';

/**
 * Generates permission codes from controller class name and route method names.
 * Pattern: {controllerPath}:{methodName} (e.g. users:create, roles:getById).
 * Controllers decorated with @SkipAutoPermission() are excluded.
 */
@Injectable()
export class PermissionGeneratorService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly permissionRepository: PermissionRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async generateFromControllers(): Promise<GeneratePermissionsResult> {
    const permissions = this.discoverControllerPermissions();
    return this.transactionService.run(async (manager) => {
      const created: string[] = [];
      const skipped: string[] = [];
      for (const { permissionCode, description } of permissions) {
        const existing = await this.permissionRepository.findOneBy(
          { permissionCode },
          manager,
        );
        if (existing) {
          skipped.push(permissionCode);
          continue;
        }
        await this.permissionRepository.create(
          {
            permissionCode,
            description: description || null,
          },
          manager,
        );
        created.push(permissionCode);
      }
      return { created, skipped };
    });
  }

  /**
   * Returns list of permission codes and descriptions from all registered controllers.
   * Uses controller path (from @Controller('path')) and method name for each route.
   */
  discoverControllerPermissions(): GeneratedPermission[] {
    const controllers = this.discoveryService.getControllers();
    const permissions: GeneratedPermission[] = [];
    const seen = new Set<string>();

    for (const wrapper of controllers) {
      const metatype = wrapper.metatype as Type & { prototype?: object };
      if (!metatype?.prototype) continue;
      if (this.reflector.get<boolean>(SKIP_AUTO_PERMISSION_KEY, metatype)) continue;

      const controllerPath = this.getControllerPath(metatype);
      if (!controllerPath) continue;

      const methodNames = this.getRouteMethodNames(metatype);
      for (const methodName of methodNames) {
        const permissionCode = `${controllerPath}:${methodName}`;
        if (seen.has(permissionCode)) continue;
        seen.add(permissionCode);
        permissions.push({
          permissionCode,
          description: `${controllerPath} - ${methodName}`,
        });
      }
    }

    return permissions.sort((a, b) =>
      a.permissionCode.localeCompare(b.permissionCode),
    );
  }

  private getControllerPath(controllerClass: Type): string | null {
    const path =
      Reflect.getMetadata(PATH_METADATA, controllerClass) ??
      this.derivePathFromClassName(controllerClass.name);
    if (path == null || path === '') return null;
    return String(path).replace(/^\//, '').toLowerCase();
  }

  private derivePathFromClassName(className: string): string {
    const withoutController = className.replace(/Controller$/i, '') || className;
    const lower = withoutController.toLowerCase();
    return lower.endsWith('s') ? lower : `${lower}s`;
  }

  // private getRouteMethodNames(controllerClass: Type): string[] {
  //   const methodNames: string[] = [];
  //   const prototype = controllerClass.prototype;
  //   if (!prototype) return methodNames;

  //   const keys = Object.getOwnPropertyNames(prototype);
  //   for (const key of keys) {
  //     if (key === 'constructor') continue;
  //     const hasRoute = Reflect.getMetadata(METHOD_METADATA, prototype, key);
  //     if (hasRoute !== undefined) {
  //       methodNames.push(key);
  //     }
  //   }
  //   return methodNames;
  // }
  private getRouteMethodNames(controllerClass: Type): string[] {
    const prototype = controllerClass.prototype;
    if (!prototype) return [];
  
    return Object.getOwnPropertyNames(prototype).filter((methodName) => {
      if (methodName === 'constructor') return false;
  
      // ตรวจว่ามี @Get/@Post/... หรือไม่
      const routePath = Reflect.getMetadata(PATH_METADATA, prototype[methodName]);
      return routePath !== undefined;
    });
  }
}

type Type = new (...args: unknown[]) => unknown;
