import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../../../src/modules/auth/guards/jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  const createMockContext = (): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    }) as unknown as ExecutionContext;

  describe('canActivate', () => {
    it('ควร return true เมื่อ route เป็น @Public()', () => {
      const context = createMockContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('ควรเรียก super.canActivate เมื่อ route ไม่ใช่ @Public()', () => {
      const context = createMockContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const superCanActivate = jest
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockReturnValue(true);

      guard.canActivate(context);
      expect(superCanActivate).toHaveBeenCalledWith(context);

      superCanActivate.mockRestore();
    });
  });

  describe('handleRequest', () => {
    it('ควร return user เมื่อมี user', () => {
      const user = { userId: 1, email: 'test@test.com' };
      const result = guard.handleRequest(null, user);
      expect(result).toBe(user);
    });

    it('ควร throw UnauthorizedException เมื่อไม่มี user', () => {
      expect(() => guard.handleRequest(null, null)).toThrow(
        UnauthorizedException,
      );
    });

    it('ควร throw error เดิมเมื่อมี error', () => {
      const err = new Error('Token expired');
      expect(() => guard.handleRequest(err, null)).toThrow(err);
    });
  });
});
