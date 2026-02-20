import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy, JwtPayload } from '../../../../src/modules/auth/strategies/jwt.strategy';
import { UserQueryService } from '../../../../src/modules/users/services/user-query.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: { get: jest.Mock };
  let userQueryService: { getById: jest.Mock };

  beforeEach(() => {
    configService = {
      get: jest.fn().mockReturnValue('test-jwt-secret'),
    };
    userQueryService = {
      getById: jest.fn(),
    };

    strategy = new JwtStrategy(
      configService as unknown as ConfigService,
      userQueryService as unknown as UserQueryService,
    );
  });

  describe('validate', () => {
    const payload: JwtPayload = {
      userId: 1,
      email: 'test@test.com',
      roleId: 1,
      roleName: 'ADMIN',
      merchantId: 5,
      permissions: ['users:read'],
    };

    it('ควร return CurrentUserPayload เมื่อ user ถูกต้องและ active', async () => {
      userQueryService.getById.mockResolvedValue({
        id: 1,
        isActive: true,
        roleName: 'SUPERADMIN',
      });

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        email: 'test@test.com',
        roleId: 1,
        roleName: 'SUPERADMIN',
        merchantId: 5,
        permissions: ['users:read'],
      });
    });

    it('ควร throw UnauthorizedException เมื่อหา user ไม่เจอ', async () => {
      userQueryService.getById.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('ควร throw UnauthorizedException เมื่อ user ไม่ active', async () => {
      userQueryService.getById.mockResolvedValue({
        id: 1,
        isActive: false,
      });

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('ควร fallback ไปใช้ roleName จาก payload เมื่อ user ไม่มี roleName', async () => {
      userQueryService.getById.mockResolvedValue({
        id: 1,
        isActive: true,
        roleName: undefined,
      });

      const result = await strategy.validate(payload);
      expect(result.roleName).toBe('ADMIN');
    });
  });
});
