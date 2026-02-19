import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName?: string;
  merchantId?: number | null;
  permissions?: string[];
}

export const CurrentUser = createParamDecorator(
  (
    data: keyof CurrentUserPayload | undefined,
    ctx: ExecutionContext,
  ): CurrentUserPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user: CurrentUserPayload = request.user as CurrentUserPayload;
    if (data && user) {
      return user[
        data as keyof CurrentUserPayload
      ] as unknown as CurrentUserPayload;
    }
    return user;
  },
);
