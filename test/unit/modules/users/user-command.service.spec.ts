import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserCommandService } from '../../../../src/modules/users/services/user-command.service';
import { UserRepository } from '../../../../src/modules/users/repositories/user.repository';
import { RoleRepository } from '../../../../src/modules/roles/repositories/role.repository';
import { MerchantRepository } from '../../../../src/modules/merchants/repositories/merchant.repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';

const mockManager = {} as any;

function createMockTransactionService() {
  return {
    run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
  };
}

describe('UserCommandService', () => {
  let service: UserCommandService;
  let userRepository: Record<string, jest.Mock>;
  let roleRepository: Record<string, jest.Mock>;
  let merchantRepository: Record<string, jest.Mock>;
  let transactionService: { run: jest.Mock };

  beforeEach(() => {
    userRepository = {
      findOneBy: jest.fn(),
      findOneById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    roleRepository = {
      findOneById: jest.fn(),
      findOneBy: jest.fn(),
    };
    merchantRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
    };
    transactionService = createMockTransactionService();

    service = new UserCommandService(
      userRepository as unknown as UserRepository,
      roleRepository as unknown as RoleRepository,
      merchantRepository as unknown as MerchantRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('create', () => {
    const dto = {
      email: 'new@test.com',
      password: 'password123',
      fullName: 'New User',
      roleId: 1,
    };

    it('ควร throw ConflictException เมื่อ email ซ้ำ', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: 1 });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('ควร throw NotFoundException เมื่อหา role ไม่เจอ', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      roleRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('ควรสร้าง user สำเร็จและ return id', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      roleRepository.findOneBy.mockResolvedValue({ id: 1, roleName: 'ADMIN' });
      userRepository.create.mockResolvedValue({ id: 99 });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 99 });
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@test.com',
          fullName: 'New User',
          roleId: 1,
          isActive: true,
        }),
        mockManager,
      );
    });

    it('ควร hash password ก่อนบันทึก', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      roleRepository.findOneBy.mockResolvedValue({ id: 1, roleName: 'ADMIN' });
      userRepository.create.mockResolvedValue({ id: 1 });

      await service.create(dto);

      const createCall = userRepository.create.mock.calls[0][0];
      expect(createCall.passwordHash).toBeDefined();
      expect(createCall.passwordHash).not.toBe('password123');
    });
  });

  describe('createUserWithMerchant', () => {
    const dto = {
      email: 'merchant@test.com',
      password: 'password123',
      fullName: 'Merchant Owner',
      shopName: 'Test Shop',
    };

    it('ควร throw ConflictException เมื่อ email ซ้ำ', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: 1 });

      await expect(service.createUserWithMerchant(dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('ควร throw NotFoundException เมื่อหา role ไม่เจอ', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      roleRepository.findOneBy.mockResolvedValue(null);

      await expect(service.createUserWithMerchant(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควรสร้าง user และ merchant สำเร็จ', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      roleRepository.findOneBy.mockResolvedValue({ id: 2, roleName: 'ADMIN_MERCHANT' });
      userRepository.create.mockResolvedValue({ id: 10, fullName: 'Merchant Owner' });
      merchantRepository.create.mockResolvedValue({ id: 20 });
      userRepository.update.mockResolvedValue(null);

      const result = await service.createUserWithMerchant(dto);

      expect(result).toEqual({ userId: 10, merchantId: 20 });
      expect(merchantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerUserId: 10,
          shopName: 'Test Shop',
        }),
        mockManager,
      );
    });
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา user ไม่เจอ', async () => {
      userRepository.findOneById.mockResolvedValue(null);

      await expect(service.update(1, { fullName: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร throw ConflictException เมื่อ email ซ้ำกับ user อื่น', async () => {
      userRepository.findOneById.mockResolvedValue({ id: 1 });
      userRepository.findOneBy.mockResolvedValue({ id: 2, email: 'dup@test.com' });

      await expect(
        service.update(1, { email: 'dup@test.com' }),
      ).rejects.toThrow(ConflictException);
    });

    it('ควร update สำเร็จ', async () => {
      userRepository.findOneById.mockResolvedValue({ id: 1, role: { id: 1 } });
      userRepository.update.mockResolvedValue(null);

      await service.update(1, { fullName: 'Updated' });

      expect(userRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ fullName: 'Updated' }),
        mockManager,
      );
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา user ไม่เจอ', async () => {
      userRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร throw ConflictException เมื่อ user มี role', async () => {
      userRepository.findOneById.mockResolvedValue({
        id: 1,
        role: { id: 1, roleName: 'ADMIN' },
      });

      await expect(service.delete(1)).rejects.toThrow(ConflictException);
    });

    it('ควร delete สำเร็จเมื่อ user ไม่มี role', async () => {
      userRepository.findOneById.mockResolvedValue({ id: 1, role: null });
      userRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });

  describe('changePassword', () => {
    it('ควร throw NotFoundException เมื่อหา user ไม่เจอ', async () => {
      userRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.changePassword(1, {
          currentPassword: 'old123',
          password: 'new123',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร throw BadRequestException เมื่อ current password ไม่ถูกต้อง', async () => {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('correctpass', 10);
      userRepository.findOneById.mockResolvedValue({
        id: 1,
        passwordHash: hash,
      });

      await expect(
        service.changePassword(1, {
          currentPassword: 'wrongpass',
          password: 'new123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('ควร update password สำเร็จ', async () => {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('oldpassword', 10);
      userRepository.findOneById.mockResolvedValue({
        id: 1,
        passwordHash: hash,
      });
      userRepository.update.mockResolvedValue(null);

      await service.changePassword(1, {
        currentPassword: 'oldpassword',
        password: 'newpassword',
      });

      expect(userRepository.update).toHaveBeenCalled();
      const updateCall = userRepository.update.mock.calls[0];
      expect(updateCall[0]).toBe(1);
    });
  });

  describe('setActive', () => {
    it('ควรเรียก update ด้วย isActive', async () => {
      userRepository.findOneById.mockResolvedValue({ id: 1, role: { id: 1 } });
      userRepository.update.mockResolvedValue(null);

      await service.setActive(1, { isActive: false });

      expect(userRepository.update).toHaveBeenCalled();
    });
  });
});
