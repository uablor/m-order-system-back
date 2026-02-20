import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../../../../src/common/policies/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (user?: Record<string, unknown>): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    }) as unknown as ExecutionContext;

  it('ควร return true เมื่อไม่มี required roles', () => {
    const context = createMockContext();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('ควร return true เมื่อ required roles เป็น array ว่าง', () => {
    const context = createMockContext();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('ควร return true เมื่อ user มี role ที่ตรงกัน', () => {
    const context = createMockContext({
      userId: 1,
      roleName: 'ADMIN',
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN', 'SUPERADMIN']);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('ควร return false เมื่อ user มี role ที่ไม่ตรงกัน', () => {
    const context = createMockContext({
      userId: 1,
      roleName: 'USER',
    });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN', 'SUPERADMIN']);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('ควร return false เมื่อไม่มี user ใน request', () => {
    const context = createMockContext(undefined);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    expect(guard.canActivate(context)).toBe(false);
  });

  it('ควร return false เมื่อ user ไม่มี roleName', () => {
    const context = createMockContext({ userId: 1 });
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

    expect(guard.canActivate(context)).toBe(false);
  });
});
