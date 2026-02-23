import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../../src/modules/users/controllers/user.controller';
import { UserCommandService } from '../../../../src/modules/users/services/user-command.service';
import { UserQueryService } from '../../../../src/modules/users/services/user-query.service';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

describe('UserController', () => {
  let controller: UserController;
  let commandService: jest.Mocked<UserCommandService>;
  let queryService: jest.Mocked<UserQueryService>;

  const mockCurrentUser: CurrentUserPayload = {
    userId: 1,
    email: 'admin@test.com',
    roleId: 1,
    roleName: 'ADMIN',
    merchantId: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserCommandService,
          useValue: {
            create: jest.fn(),
            createUserWithMerchant: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            changePassword: jest.fn(),
            setActive: jest.fn(),
          },
        },
        {
          provide: UserQueryService,
          useValue: {
            getList: jest.fn(),
            getById: jest.fn(),
            getByIdOrFail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    commandService = module.get(UserCommandService);
    queryService = module.get(UserQueryService);
  });

  it('ควรสร้าง controller ได้', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('ควรเรียก commandService.create ด้วย dto ที่ถูกต้อง', async () => {
      const dto = {
        email: 'new@test.com',
        password: 'password123',
        fullName: 'New User',
        roleId: 1,
      };
      commandService.create.mockResolvedValue({ id: 1 });

      const result = await controller.adminCreate(dto);

      expect(commandService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('createUserWithMerchant', () => {
    it('ควรเรียก commandService.createUserWithMerchant', async () => {
      const dto = {
        email: 'merchant@test.com',
        password: 'password123',
        fullName: 'Merchant Owner',
        shopName: 'Test Shop',
      };
      commandService.createUserWithMerchant.mockResolvedValue({
        userId: 1,
        merchantId: 10,
      });

      const result = await controller.adminCreateWithMerchant(dto);

      expect(commandService.createUserWithMerchant).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ userId: 1, merchantId: 10 });
    });
  });

  describe('adminGetList', () => {
    it('ควรเรียก queryService.getList ด้วย query', async () => {
      const query = { page: 1, limit: 10 };
      const mockResponse = {
        success: true,
        Code: 200,
        message: 'Success',
        results: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      queryService.getList.mockResolvedValue(mockResponse);

      const result = await controller.adminGetList(query);

      expect(queryService.getList).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getListBy', () => {
    it('ควรเรียก queryService.getList ด้วย merchantId จาก currentUser', async () => {
      const query = { page: 1, limit: 10 };
      queryService.getList.mockResolvedValue({
        success: true,
        Code: 200,
        message: 'Success',
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await controller.merchantGetList(query, mockCurrentUser);

      expect(queryService.getList).toHaveBeenCalledWith(query, 10);
    });
  });

  describe('getById', () => {
    it('ควร return user เมื่อเจอ', async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        fullName: 'User',
        roleId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
      };
      queryService.getById.mockResolvedValue(mockUser);

      const result = await controller.getById(1);

      expect(queryService.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('ควรเรียก commandService.update ด้วย id และ dto', async () => {
      const dto = { fullName: 'Updated Name' };
      commandService.update.mockResolvedValue(undefined);

      await controller.adminUpdate(1, dto);

      expect(commandService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('updateProfile', () => {
    it('ควรเรียก commandService.update ด้วย userId จาก currentUser', async () => {
      const dto = { fullName: 'My New Name' };
      commandService.update.mockResolvedValue(undefined);

      await controller.updateProfile(dto, mockCurrentUser);

      expect(commandService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('delete', () => {
    it('ควรเรียก commandService.delete ด้วย id', async () => {
      commandService.delete.mockResolvedValue(undefined);

      await controller.adminDelete(5);

      expect(commandService.delete).toHaveBeenCalledWith(5);
    });
  });

  describe('ChangePassword', () => {
    it('ควรเรียก commandService.changePassword ด้วย userId จาก currentUser', async () => {
      const dto = { password: 'newpass123', currentPassword: 'oldpass123' };
      commandService.changePassword.mockResolvedValue(undefined);

      await controller.changePassword(dto, mockCurrentUser);

      expect(commandService.changePassword).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('updateActive', () => {
    it('ควรเรียก commandService.setActive ด้วย id และ dto', async () => {
      const dto = { isActive: false };
      commandService.setActive.mockResolvedValue(undefined);

      await controller.adminUpdateActive(5, dto);

      expect(commandService.setActive).toHaveBeenCalledWith(5, dto);
    });
  });
});
