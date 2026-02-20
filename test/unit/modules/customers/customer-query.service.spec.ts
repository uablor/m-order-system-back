import { NotFoundException } from '@nestjs/common';
import { CustomerQueryService } from '../../../../src/modules/customers/services/customer-query.service';
import { CustomerQueryRepository } from '../../../../src/modules/customers/repositories/customer.query-repository';

describe('CustomerQueryService', () => {
  let service: CustomerQueryService;
  let customerQueryRepository: {
    findOneByIdWithMerchant: jest.Mock;
    findWithPagination: jest.Mock;
  };

  const mockCustomer = {
    id: 1,
    merchant: { id: 10 },
    customerName: 'ลูกค้า A',
    customerType: 'CUSTOMER',
    shippingAddress: 'Vientiane',
    shippingProvider: null,
    shippingSource: null,
    shippingDestination: null,
    paymentTerms: null,
    contactPhone: '020-1234567',
    contactFacebook: null,
    contactWhatsapp: null,
    contactLine: null,
    preferredContactMethod: 'PHONE',
    uniqueToken: 'abc123',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    customerQueryRepository = {
      findOneByIdWithMerchant: jest.fn(),
      findWithPagination: jest.fn(),
    };

    service = new CustomerQueryService(
      customerQueryRepository as unknown as CustomerQueryRepository,
    );
  });

  describe('getById', () => {
    it('ควร return customer เมื่อเจอ', async () => {
      customerQueryRepository.findOneByIdWithMerchant.mockResolvedValue(mockCustomer);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.id).toBe(1);
      expect(result!.customerName).toBe('ลูกค้า A');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      customerQueryRepository.findOneByIdWithMerchant.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      customerQueryRepository.findOneByIdWithMerchant.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร return wrapped response เมื่อเจอ', async () => {
      customerQueryRepository.findOneByIdWithMerchant.mockResolvedValue(mockCustomer);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      customerQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockCustomer],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });

    it('ควรใช้ merchantId จาก currentUser เมื่อมี', async () => {
      customerQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList(
        { page: 1, limit: 10 },
        { userId: 1, email: 'a@b.com', roleId: 1, merchantId: 5 },
      );

      expect(customerQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ merchantId: 5 }),
      );
    });
  });
});
