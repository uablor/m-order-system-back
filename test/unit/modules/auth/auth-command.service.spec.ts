import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCommandService } from '../../../../src/modules/auth/services/auth-command.service';
import { UserQueryRepository } from '../../../../src/modules/users/repositories/user.query-repository';
import { RolePermissionQueryService } from '../../../../src/modules/role-permissions/services/role-permission-query.service';

describe('AuthCommandService', () => {
  let service: AuthCommandService;
  let userQueryRepository: { repository: { findOne: jest.Mock } };
  let rolePermissionQueryService: { getPermissionsByRoleId: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(() => {
    userQueryRepository = {
      repository: { findOne: jest.fn() },
    };
    rolePermissionQueryService = {
      getPermissionsByRoleId: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    service = new AuthCommandService(
      userQueryRepository as unknown as UserQueryRepository,
      rolePermissionQueryService as unknown as RolePermissionQueryService,
      jwtService as unknown as JwtService,
    );
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      email: 'admin@test.com',
      passwordHash: '$2b$10$validhash',
      fullName: 'Admin User',
      roleId: 1,
      isActive: true,
      merchantId: 10,
      role: { id: 1, roleName: 'ADMIN' },
      merchant: { id: 10 },
    };

    it('ควร throw UnauthorizedException เมื่อหา user ไม่เจอ', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@test.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('ควร throw UnauthorizedException เมื่อ user ไม่ active', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(
        service.login({ email: 'admin@test.com', password: '123456' }),
      ).rejects.toThrow(new UnauthorizedException('Account is inactive'));
    });

    it('ควร throw UnauthorizedException เมื่อ password ไม่ถูกต้อง', async () => {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('correctpassword', 10);

      userQueryRepository.repository.findOne.mockResolvedValue({
        ...mockUser,
        passwordHash: hash,
      });

      await expect(
        service.login({ email: 'admin@test.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('ควร return token เมื่อ login สำเร็จ', async () => {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('correctpassword', 10);

      userQueryRepository.repository.findOne.mockResolvedValue({
        ...mockUser,
        passwordHash: hash,
      });

      rolePermissionQueryService.getPermissionsByRoleId.mockResolvedValue({
        results: [
          { permissionCode: 'users:read' },
          { permissionCode: 'users:write' },
        ],
      });

      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login({
        email: 'admin@test.com',
        password: 'correctpassword',
      });

      expect(result.success).toBe(true);
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user).toBeDefined();
      expect(result.user!.email).toBe('admin@test.com');
      expect(result.user!.userId).toBe(1);
      expect(result.user!.merchantId).toBe(10);
      expect(result.message).toBe('Login successful');
    });

    it('ควร sign JWT ด้วย payload ที่ถูกต้อง', async () => {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('pass123', 10);

      userQueryRepository.repository.findOne.mockResolvedValue({
        ...mockUser,
        passwordHash: hash,
      });

      rolePermissionQueryService.getPermissionsByRoleId.mockResolvedValue({
        results: [{ permissionCode: 'users:read' }],
      });

      jwtService.sign.mockReturnValue('token');

      await service.login({ email: 'admin@test.com', password: 'pass123' });

      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          email: 'admin@test.com',
          roleId: 1,
          roleName: 'ADMIN',
          merchantId: 10,
          permissions: ['users:read'],
        }),
      );
    });
  });
});
