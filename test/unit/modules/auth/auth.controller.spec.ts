import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../../src/modules/auth/controllers/auth.controller';
import { AuthCommandService } from '../../../../src/modules/auth/services/auth-command.service';
import { AuthQueryService } from '../../../../src/modules/auth/services/auth-query.service';
import { LoginDto } from '../../../../src/modules/auth/dto/login.dto';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

describe('AuthController', () => {
  let controller: AuthController;
  let commandService: jest.Mocked<AuthCommandService>;
  let queryService: jest.Mocked<AuthQueryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthCommandService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: AuthQueryService,
          useValue: {
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandService = module.get(AuthCommandService);
    queryService = module.get(AuthQueryService);
  });

  it('ควรสร้าง controller ได้', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('ควรเรียก commandService.login ด้วย dto ที่ถูกต้อง', async () => {
      const dto: LoginDto = { email: 'test@test.com', password: 'password123' };
      const expectedResponse = {
        success: true,
        message: 'Login successful',
        access_token: 'jwt-token',
        user: {
          userId: 1,
          email: 'test@test.com',
          fullName: 'Test User',
          roleId: 1,
          roleName: 'ADMIN',
        },
      };

      commandService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(dto);

      expect(commandService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('me', () => {
    it('ควรเรียก queryService.getProfile ด้วย userId ที่ถูกต้อง', async () => {
      const user: CurrentUserPayload = {
        userId: 1,
        email: 'test@test.com',
        roleId: 1,
        roleName: 'ADMIN',
      };
      const expectedResponse = {
        success: true,
        Code: 200,
        message: 'Success',
        results: [
          {
            userId: 1,
            email: 'test@test.com',
            fullName: 'Test User',
            roleId: 1,
            roleName: 'ADMIN',
          },
        ],
      };

      queryService.getProfile.mockResolvedValue(expectedResponse);

      const result = await controller.me(user);

      expect(queryService.getProfile).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });
  });
});
