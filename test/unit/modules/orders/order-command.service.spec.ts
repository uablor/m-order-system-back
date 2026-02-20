import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderCommandService } from '../../../../src/modules/orders/services/order-command.service';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

const mockManager = {} as any;

const mockCurrentUser: CurrentUserPayload = {
  userId: 1,
  email: 'admin@test.com',
  roleId: 1,
  roleName: 'ADMIN',
  merchantId: 10,
};

// mock exchange rate entities ที่ใช้ทดสอบ
const mockBuyRateEntity = { rate: '650.000000', rateType: 'BUY', baseCurrency: 'THB' } as any;
const mockSellRateEntity = { rate: '670.000000', rateType: 'SELL', baseCurrency: 'THB' } as any;

describe('OrderCommandService', () => {
  let service: OrderCommandService;
  let transactionService: { run: jest.Mock };
  let orderRepository: Record<string, jest.Mock>;
  let orderItemRepository: Record<string, jest.Mock>;
  let customerOrderRepository: Record<string, jest.Mock>;
  let customerOrderItemRepository: Record<string, jest.Mock>;
  let merchantRepository: Record<string, jest.Mock>;
  let customerRepository: Record<string, jest.Mock>;
  let exchangeRateQueryRepository: Record<string, jest.Mock>;

  beforeEach(() => {
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };
    orderRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getRepo: jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) }),
    };
    orderItemRepository = {
      create: jest.fn(),
      update: jest.fn(),
    };
    customerOrderRepository = {
      create: jest.fn(),
    };
    customerOrderItemRepository = {
      create: jest.fn(),
    };
    merchantRepository = {
      findOneById: jest.fn(),
    };
    customerRepository = {
      findOneById: jest.fn(),
    };
    exchangeRateQueryRepository = {
      findTodayRates: jest.fn().mockResolvedValue({
        buy: mockBuyRateEntity,
        sell: mockSellRateEntity,
      }),
    };

    service = new OrderCommandService(
      transactionService as unknown as TransactionService,
      orderRepository as any,
      orderItemRepository as any,
      customerOrderRepository as any,
      customerOrderItemRepository as any,
      merchantRepository as any,
      customerRepository as any,
      exchangeRateQueryRepository as any,
    );
  });

  describe('create', () => {
    const dto = {
      merchantId: 1,
      orderCode: 'ORD-001',
      orderDate: '2025-06-15',
    };

    it('ควร throw NotFoundException เมื่อหา merchant ไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(service.create(dto, 1)).rejects.toThrow(NotFoundException);
    });

    it('ควรสร้าง order สำเร็จ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      orderRepository.create.mockResolvedValue({ id: 100 });

      const result = await service.create(dto, 1);

      expect(result).toEqual({ id: 100 });
      expect(orderRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          orderCode: 'ORD-001',
          paymentStatus: 'UNPAID',
        }),
        mockManager,
      );
    });

    it('ควรตั้ง default shipping cost เป็น 0 เมื่อไม่ระบุ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      orderRepository.create.mockResolvedValue({ id: 1 });

      await service.create(dto, 1);

      const createArg = orderRepository.create.mock.calls[0][0];
      expect(createArg.totalShippingCostLak).toBe('0');
    });

    it('ควรรับค่า shipping cost ที่กำหนดได้', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      orderRepository.create.mockResolvedValue({ id: 1 });

      await service.create({ ...dto, totalShippingCostLak: 500 }, 1);

      const createArg = orderRepository.create.mock.calls[0][0];
      expect(createArg.totalShippingCostLak).toBe('500');
    });
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา order ไม่เจอ', async () => {
      orderRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.update(1, { orderCode: 'ORD-002' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร update order สำเร็จ', async () => {
      orderRepository.findOneById.mockResolvedValue({
        id: 1,
        totalSellingAmountLak: '10000',
      });
      orderRepository.update.mockResolvedValue(null);

      await service.update(1, { orderCode: 'ORD-002' });

      expect(orderRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ orderCode: 'ORD-002' }),
        mockManager,
      );
    });

    it('ควรคำนวณ remainingAmount เมื่อ update paidAmount', async () => {
      orderRepository.findOneById.mockResolvedValue({
        id: 1,
        totalSellingAmountLak: '10000.00',
      });
      orderRepository.update.mockResolvedValue(null);

      await service.update(1, { paidAmount: 3000 });

      const updateArg = orderRepository.update.mock.calls[0][1];
      expect(updateArg.paidAmount).toBe('3000');
      expect(updateArg.remainingAmount).toBe('7000');
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา order ไม่เจอ', async () => {
      orderRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete สำเร็จ', async () => {
      orderRepository.findOneById.mockResolvedValue({ id: 1 });
      orderRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(orderRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });

  describe('createFull', () => {
    // DTO ไม่มี buyExchangeRate/sellExchangeRate/purchaseCurrency อีกต่อไป → ดึงจาก DB
    const baseItem = {
      Index: 0,
      productName: 'Product A',
      quantity: 1,
      purchasePrice: 100,
      shippingPrice: 10,
      sellingPriceForeign: 150,
    };

    const baseDto = {
      orderCode: 'ORD-FULL-001',
      items: [baseItem],
      customerOrders: [],
    };

    beforeEach(() => {
      merchantRepository.findOneById.mockResolvedValue({ id: 10 });
      orderRepository.create.mockResolvedValue({ id: 1 });
      orderRepository.update.mockResolvedValue(null);
      // default: both rates available (BUY=650, SELL=670)
      exchangeRateQueryRepository.findTodayRates.mockResolvedValue({
        buy: mockBuyRateEntity,
        sell: mockSellRateEntity,
      });
    });

    it('ควร throw NotFoundException เมื่อหา merchant ไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.createFull(baseDto as any, mockCurrentUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร throw BadRequestException เมื่อไม่มี BUY rate ในวันนี้', async () => {
      exchangeRateQueryRepository.findTodayRates.mockResolvedValue({
        buy: null,
        sell: mockSellRateEntity,
      });

      await expect(
        service.createFull(baseDto as any, mockCurrentUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('ควร throw BadRequestException เมื่อไม่มี SELL rate ในวันนี้', async () => {
      exchangeRateQueryRepository.findTodayRates.mockResolvedValue({
        buy: mockBuyRateEntity,
        sell: null,
      });

      await expect(
        service.createFull(baseDto as any, mockCurrentUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('ควร throw BadRequestException เมื่อทั้ง BUY และ SELL rate ไม่มีในวันนี้', async () => {
      exchangeRateQueryRepository.findTodayRates.mockResolvedValue({
        buy: null,
        sell: null,
      });

      await expect(
        service.createFull(baseDto as any, mockCurrentUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('ควรเรียก findTodayRates ด้วย merchantId ที่ถูกต้อง', async () => {
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      expect(exchangeRateQueryRepository.findTodayRates).toHaveBeenCalledWith(
        mockCurrentUser.merchantId,
      );
    });

    it('ควรคำนวณ total_buy_lak = buy_price × qty × buyRate (650 จาก DB)', async () => {
      // 100 THB × 1 qty × 650 = 65,000 LAK
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.purchaseTotalLak).toBe('65000');
    });

    it('ควรบันทึก purchaseCurrency จาก baseCurrency ของ BUY rate (THB)', async () => {
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.purchaseCurrency).toBe('THB');
    });

    it('ควรบันทึก buyRate (650) จาก DB ใน purchaseExchangeRate', async () => {
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(Number(itemArg.purchaseExchangeRate)).toBe(650);
    });

    it('ควรบันทึก sellRate (670) จาก DB ใน sellingExchangeRate', async () => {
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(Number(itemArg.sellingExchangeRate)).toBe(670);
    });

    it('ควรคำนวณ shipping_lak = shipping_price × buyRate (10 × 650 = 6500)', async () => {
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.shippingLak).toBe('6500');
    });

    it('ควรคำนวณ subtotal_lak = total_buy_lak + shipping_lak (65000 + 6500 = 71500)', async () => {
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.totalCostBeforeDiscountLak).toBe('71500');
    });

    it('ควรคำนวณ discount cash = discount_value × buyRate (5 × 650 = 3250)', async () => {
      const dtoWithDiscount = {
        ...baseDto,
        items: [{ ...baseItem, discountType: 'cash', discountValue: 5 }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoWithDiscount as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.discountAmountLak).toBe('3250');
    });

    it('ควรคำนวณ discount percent = subtotal × % (71500 × 10% = 7150)', async () => {
      const dtoWithDiscount = {
        ...baseDto,
        items: [{ ...baseItem, discountType: 'percent', discountValue: 10 }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoWithDiscount as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.discountAmountLak).toBe('7150');
    });

    it('ควรคำนวณ final_buy_lak ตัวอย่าง plan: 71500 - 3250 = 68250', async () => {
      const dtoWithDiscount = {
        ...baseDto,
        items: [{ ...baseItem, discountType: 'cash', discountValue: 5 }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoWithDiscount as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.finalCostLak).toBe('68250');
    });

    it('ควรคำนวณ sell_price_lak = sell_price × qty × sellRate (150 × 1 × 670 = 100500)', async () => {
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(baseDto as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.sellingTotalLak).toBe('100500');
    });

    it('ควรคำนวณ profit_lak ตัวอย่าง plan: 100500 - 68250 = 32250', async () => {
      const dtoWithDiscount = {
        ...baseDto,
        items: [{ ...baseItem, discountType: 'cash', discountValue: 5 }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoWithDiscount as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.profitLak).toBe('32250');
    });

    it('ควรคำนวณ profit_thb = profit_lak / sellRate (32250 / 670 ≈ 48.13)', async () => {
      const dtoWithDiscount = {
        ...baseDto,
        items: [{ ...baseItem, discountType: 'cash', discountValue: 5 }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoWithDiscount as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(Number(itemArg.profitThb)).toBeCloseTo(32250 / 670, 2);
    });

    it('ควร map discountType: cash → FIX ใน entity', async () => {
      const dtoWithDiscount = {
        ...baseDto,
        items: [{ ...baseItem, discountType: 'cash', discountValue: 5 }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoWithDiscount as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.discountType).toBe('FIX');
    });

    it('ควร map discountType: percent → PERCENT ใน entity', async () => {
      const dtoWithDiscount = {
        ...baseDto,
        items: [{ ...baseItem, discountType: 'percent', discountValue: 10 }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoWithDiscount as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.discountType).toBe('PERCENT');
    });

    it('ควรจัดการกรณีไม่มี shippingPrice (default 0)', async () => {
      const dtoNoShipping = {
        ...baseDto,
        items: [{ ...baseItem, shippingPrice: undefined }],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await service.createFull(dtoNoShipping as any, mockCurrentUser);

      const itemArg = orderItemRepository.create.mock.calls[0][0];
      expect(itemArg.shippingLak).toBe('0');
      expect(itemArg.totalCostBeforeDiscountLak).toBe('65000');
    });

    it('ควร throw BadRequestException เมื่อ orderItemIndex ไม่ถูกต้อง', async () => {
      const dtoWithBadIndex = {
        ...baseDto,
        items: [baseItem],
        customerOrders: [
          {
            customerId: 1,
            items: [{ orderItemIndex: 99, quantity: 1 }],
          },
        ],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity }),
      );

      await expect(
        service.createFull(dtoWithBadIndex as any, mockCurrentUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('ควร throw BadRequestException เมื่อ customer quantity เกิน stock', async () => {
      const dtoOverStock = {
        ...baseDto,
        items: [baseItem],
        customerOrders: [
          {
            customerId: 1,
            items: [{ orderItemIndex: 0, quantity: 999 }],
          },
        ],
      };
      orderItemRepository.create.mockImplementation((data) =>
        Promise.resolve({ ...data, id: 1, quantityRemaining: data.quantity, quantity: data.quantity }),
      );

      await expect(
        service.createFull(dtoOverStock as any, mockCurrentUser),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
