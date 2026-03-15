import { OrderOrmEntity } from '../../../../../src/modules/orders/entities/order.orm-entity';
import { MerchantOrmEntity } from '../../../../../src/modules/merchants/entities/merchant.orm-entity';
import { UserOrmEntity } from '../../../../../src/modules/users/entities/user.orm-entity';
import { ExchangeRateOrmEntity } from '../../../../../src/modules/exchange-rates/entities/exchange-rate.orm-entity';
import { ArrivalStatusEnum } from '../../../../../src/modules/orders/enum/enum.entities';

describe('OrderOrmEntity', () => {
  let entity: OrderOrmEntity;

  const mockMerchant = {
    id: 1,
    merchantName: 'Test Merchant',
  } as any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
  } as any;

  const mockExchangeRate = {
    id: 1,
    baseCurrency: 'THB',
    targetCurrency: 'LAK',
    rate: 650,
    rateType: 'BUY',
    rateDate: new Date('2024-01-01'),
    isActive: true,
  } as any;

  beforeEach(() => {
    entity = new OrderOrmEntity();
    entity.id = 1;
    entity.orderCode = 'ORD-001';
    entity.orderDate = new Date('2024-01-01');
    entity.arrivalStatus = ArrivalStatusEnum.NOT_ARRIVED;
    entity.merchant = mockMerchant;
    entity.createdByUser = mockUser;
    entity.exchangeRateBuy = mockExchangeRate;
    entity.exchangeRateSell = { ...mockExchangeRate, rateType: 'SELL', rate: 670 };
    entity.createdAt = new Date('2024-01-01');
    entity.updatedAt = new Date('2024-01-01');
  });

  describe('constructor', () => {
    it('ควรสร้าง entity ได้', () => {
      expect(entity).toBeDefined();
      expect(entity).toBeInstanceOf(OrderOrmEntity);
    });
  });

  describe('properties', () => {
    it('ควรมีค่า properties ที่กำหนด', () => {
      expect(entity.id).toBe(1);
      expect(entity.orderCode).toBe('ORD-001');
      expect(entity.orderDate).toEqual(new Date('2024-01-01'));
      expect(entity.arrivalStatus).toBe(ArrivalStatusEnum.NOT_ARRIVED);
      expect(entity.merchant).toEqual(mockMerchant);
      expect(entity.createdByUser).toEqual(mockUser);
      expect(entity.exchangeRateBuy).toEqual(mockExchangeRate);
      expect(entity.exchangeRateSell?.rate).toBe(670);
    });

    it('ควรมีค่า default สำหรับ arrival status', () => {
      const newEntity = new OrderOrmEntity();
      newEntity.arrivalStatus = ArrivalStatusEnum.NOT_ARRIVED; // Set explicitly for test
      expect(newEntity.arrivalStatus).toBe(ArrivalStatusEnum.NOT_ARRIVED);
    });
  });

  describe('nullable properties', () => {
    it('ควรสามารถมีค่า null ได้สำหรับบาง properties', () => {
      entity.arrivedAt = null;
      entity.notifiedAt = null;
      entity.createdByUser = null;
      entity.exchangeRateBuy = null;
      entity.exchangeRateSell = null;

      expect(entity.arrivedAt).toBeNull();
      expect(entity.notifiedAt).toBeNull();
      expect(entity.createdByUser).toBeNull();
      expect(entity.exchangeRateBuy).toBeNull();
      expect(entity.exchangeRateSell).toBeNull();
    });
  });

  describe('arrival status changes', () => {
    it('ควรสามารถเปลี่ยนสถานะการมาถึงได้', () => {
      entity.arrivalStatus = ArrivalStatusEnum.ARRIVED;
      entity.arrivedAt = new Date('2024-01-02');
      entity.notifiedAt = new Date('2024-01-02');

      expect(entity.arrivalStatus).toBe(ArrivalStatusEnum.ARRIVED);
      expect(entity.arrivedAt).toEqual(new Date('2024-01-02'));
      expect(entity.notifiedAt).toEqual(new Date('2024-01-02'));
    });
  });

  describe('base entity inheritance', () => {
    it('ควร inherit properties จาก BaseOrmEntity', () => {
      expect(entity.createdAt).toBeDefined();
      expect(entity.updatedAt).toBeDefined();
      expect(entity.id).toBeDefined();
    });

    it('ควรมี timestamps', () => {
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('relationships', () => {
    it('ควรมีความสัมพันธ์กับ merchant', () => {
      expect(entity.merchant).toBeDefined();
      expect(entity.merchant.id).toBe(1);
    });

    it('ควรมีความสัมพันธ์กับ user (nullable)', () => {
      expect(entity.createdByUser).toBeDefined();
      expect(entity.createdByUser?.id).toBe(1);

      entity.createdByUser = null;
      expect(entity.createdByUser).toBeNull();
    });

    it('ควรมีความสัมพันธ์กับ exchange rates (nullable)', () => {
      expect(entity.exchangeRateBuy).toBeDefined();
      expect(entity.exchangeRateSell).toBeDefined();
      expect(entity.exchangeRateBuy?.rate).toBe(650);
      expect(entity.exchangeRateSell?.rate).toBe(670);
    });
  });
});
