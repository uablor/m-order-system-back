import { RoleRepository } from '../../modules/roles/repositories/role.repository';
import { RoleOrmEntity } from '../../modules/roles/entities/role.orm-entity';

export const SUPERADMIN_ROLE_NAME = 'superadmin';

export async function runRoleSeeder(roleRepository: RoleRepository): Promise<RoleOrmEntity> {
  let role = await roleRepository.findOneBy({ roleName: SUPERADMIN_ROLE_NAME });
  if (role) {
    console.log('Role "superadmin" already exists.');
    return role;
  }
  role = await roleRepository.create({
    roleName: SUPERADMIN_ROLE_NAME,
    description: 'Super administrator with all permissions',
  } as Partial<RoleOrmEntity>);
  console.log('Role "superadmin" created.');
  return role;
}
