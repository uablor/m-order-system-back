import { UserRepository } from '../../modules/users/repositories/user.repository';
import { hashPassword } from '../../common/utils/password.util';
import { UserOrmEntity } from '../../modules/users/entities/user.orm-entity';
import { EntityManager } from 'typeorm';

export const SUPERADMIN_EMAIL = 'superadmin@admin.com';
export const SUPERADMIN_DEFAULT_PASSWORD = 'SuperAdmin@123';

export async function runUserSeeder(
  userRepository: UserRepository,
  roleId: number,
  password: string = SUPERADMIN_DEFAULT_PASSWORD,
  manager: EntityManager
): Promise<UserOrmEntity | null> {
  const existing = await userRepository.findOneBy({ email: SUPERADMIN_EMAIL },manager);
  if (existing) {
    console.log(`User "${SUPERADMIN_EMAIL}" already exists.`);
    return existing;
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({
    email: SUPERADMIN_EMAIL,
    passwordHash,
    fullName: 'Super Admin',
    roleId,
    isActive: true,
  } as Partial<UserOrmEntity>,manager);
  console.log(`User "${SUPERADMIN_EMAIL}" created (password: ${password}).`);
  return user;
}
