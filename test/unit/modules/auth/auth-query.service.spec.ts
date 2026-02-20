import { NotFoundException } from '@nestjs/common';
import { AuthQueryService } from '../../../../src/modules/auth/services/auth-query.service';
import { UserQueryRepository } from '../../../../src/modules/users/repositories/user.query-repository';
import { RolePermissionQueryService } from '../../../../src/modules/role-permissions/services/role-permission-query.service';

describe('AuthQueryService', () => {
  let service: AuthQueryService;
  let userQueryRepository: { repository: { findOne: jest.Mock } };
  let rolePermissionQueryService: { getPermissionsByRoleId: jest.Mock };

  beforeEach(() => {
    userQueryRepository = {
      repository: { findOne: jest.fn() },
    };
    rolePermissionQueryService = {
      getPermissionsByRoleId: jest.fn(),
    };

    service = new AuthQueryService(
      userQueryRepository as unknown as UserQueryRepository,
      rolePermissionQueryService as unknown as RolePermissionQueryService,
    );
  });

  describe('getProfile', () => {
    const mockUser = {
      id: 1,
      email: 'user@test.com',
      fullName: 'Test User',
      roleId: 2,
      isActive: true,
      merchantId: 5,
      role: { id: 2, roleName: 'MERCHANT_ADMIN' },
      merchant: { id: 5 },
    };

    it('ควร throw NotFoundException เมื่อหา user ไม่เจอ', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(NotFoundException);
    });

    it('ควร throw NotFoundException เมื่อ user ไม่ active', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(service.getProfile(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร return profile ที่ถูกต้อง', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(mockUser);
      rolePermissionQueryService.getPermissionsByRoleId.mockResolvedValue({
        results: [
          { permissionCode: 'orders:read' },
          { permissionCode: 'orders:write' },
        ],
      });

      const result = await service.getProfile(1);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      const profile = result.results![0];
      expect(profile.userId).toBe(1);
      expect(profile.email).toBe('user@test.com');
      expect(profile.fullName).toBe('Test User');
      expect(profile.permissions).toEqual(['orders:read', 'orders:write']);
    });

    it('ควร query ด้วย userId และ relations ที่ถูกต้อง', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(mockUser);
      rolePermissionQueryService.getPermissionsByRoleId.mockResolvedValue({
        results: [],
      });

      await service.getProfile(1);

      expect(userQueryRepository.repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['role', 'merchant'],
      });
    });

    it('ควรจัดการ empty permissions ได้', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(mockUser);
      rolePermissionQueryService.getPermissionsByRoleId.mockResolvedValue({
        results: [],
      });

      const result = await service.getProfile(1);
      const profile = result.results![0];
      expect(profile.permissions).toEqual([]);
    });

    it('ควรจัดการ merchantId จาก entity หรือ relation ได้', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue({
        ...mockUser,
        merchantId: null,
        merchant: { id: 7 },
      });
      rolePermissionQueryService.getPermissionsByRoleId.mockResolvedValue({
        results: [],
      });

      const result = await service.getProfile(1);
      const profile = result.results![0];
      expect(profile.merchantId).toBe(7);
    });
  });
});
