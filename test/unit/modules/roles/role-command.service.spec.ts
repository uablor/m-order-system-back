import { ConflictException, NotFoundException } from '@nestjs/common';
import { RoleCommandService } from '../../../../src/modules/roles/services/role-command.service';
import { RoleRepository } from '../../../../src/modules/roles/repositories/role.repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';

const mockManager = {} as any;

describe('RoleCommandService', () => {
  let service: RoleCommandService;
  let roleRepository: Record<string, jest.Mock>;
  let transactionService: { run: jest.Mock };

  beforeEach(() => {
    roleRepository = {
      create: jest.fn(),
      findOneBy: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    service = new RoleCommandService(
      roleRepository as unknown as RoleRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('create', () => {
    it('ควร throw ConflictException เมื่อชื่อ role ซ้ำ', async () => {
      roleRepository.findOneBy.mockResolvedValue({ id: 1, roleName: 'ADMIN' });

      await expect(
        service.create({ roleName: 'ADMIN' }),
      ).rejects.toThrow(ConflictException);
    });

    it('ควรสร้าง role สำเร็จ', async () => {
      roleRepository.findOneBy.mockResolvedValue(null);
      roleRepository.create.mockResolvedValue({ id: 5 });

      const result = await service.create({
        roleName: 'MANAGER',
        description: 'Manager role',
      });

      expect(result).toEqual({ id: 5 });
    });
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา role ไม่เจอ', async () => {
      roleRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.update(1, { roleName: 'NEW_NAME' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร throw ConflictException เมื่อชื่อ role ซ้ำกับ role อื่น', async () => {
      roleRepository.findOneById.mockResolvedValue({ id: 1 });
      roleRepository.findOneBy.mockResolvedValue({ id: 2, roleName: 'EXISTING' });

      await expect(
        service.update(1, { roleName: 'EXISTING' }),
      ).rejects.toThrow(ConflictException);
    });

    it('ควร update สำเร็จ', async () => {
      roleRepository.findOneById.mockResolvedValue({ id: 1 });
      roleRepository.findOneBy.mockResolvedValue(null);
      roleRepository.update.mockResolvedValue(null);

      await service.update(1, { roleName: 'UPDATED', description: 'Desc' });

      expect(roleRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ roleName: 'UPDATED', description: 'Desc' }),
        mockManager,
      );
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา role ไม่เจอ', async () => {
      roleRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete สำเร็จ', async () => {
      roleRepository.findOneById.mockResolvedValue({ id: 1 });
      roleRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(roleRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });
});
