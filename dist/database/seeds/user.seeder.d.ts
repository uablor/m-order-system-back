import { UserRepository } from '../../modules/users/repositories/user.repository';
import { UserOrmEntity } from '../../modules/users/entities/user.orm-entity';
import { EntityManager } from 'typeorm';
export declare const SUPERADMIN_EMAIL = "superadmin@admin.com";
export declare const SUPERADMIN_DEFAULT_PASSWORD = "SuperAdmin@123";
export declare function runUserSeeder(userRepository: UserRepository, roleId: number, password: string | undefined, manager: EntityManager): Promise<UserOrmEntity | null>;
