import { RoleRepository } from '../../modules/roles/repositories/role.repository';
import { RoleOrmEntity } from '../../modules/roles/entities/role.orm-entity';
import { EntityManager } from 'typeorm';

export const SUPERADMIN_ROLE_NAME = 'superadmin';
export const ADMIN_ROLE_NAME = 'admin';
export const ADMIN_MERCHANT_ROLE_NAME = 'admin_merchant';
export const EMPLOYEE_MERCHANT_ROLE_NAME = 'employee_merchant';

const ROLES_TO_SEED: { roleName: string; description: string }[] = [
  { roleName: SUPERADMIN_ROLE_NAME, description: 'Super administrator with all permissions' },
  { roleName: ADMIN_ROLE_NAME, description: 'Administrator with all permissions' },
  { roleName: ADMIN_MERCHANT_ROLE_NAME, description: 'Administrator of a merchant' },
  { roleName: EMPLOYEE_MERCHANT_ROLE_NAME, description: 'Employee of a merchant' },
];

export interface SeededRoles {
  superadmin: RoleOrmEntity;
  admin: RoleOrmEntity;
  admin_merchant: RoleOrmEntity;
  employee_merchant: RoleOrmEntity;
}

export async function runRoleSeeder(roleRepository: RoleRepository, manager?: EntityManager): Promise<SeededRoles> {
  const result: Partial<SeededRoles> = {};

  for (const { roleName, description } of ROLES_TO_SEED) {
    let role = await roleRepository.findOneBy({ roleName });
    if (role) {
      console.log(`Role "${roleName}" already exists.`);
    } else {
      role = await roleRepository.create({
        roleName,
        description,
      } as Partial<RoleOrmEntity>);
      console.log(`Role "${roleName}" created.`);
    }
    const key = roleName as keyof SeededRoles;
    result[key] = role;
  }

  return result as SeededRoles;
}
