import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { SortDirection } from '../../../common/base/enums/base.query.enum';
import { PaymentListQueryDto } from '../dto/payment-list-query.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentOrmEntity)
    private readonly repository: Repository<PaymentOrmEntity>,
  ) {}

  async create(
    data: Partial<PaymentOrmEntity>,
    manager?: any,
  ): Promise<PaymentOrmEntity> {
    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    const payment = repo.create(data);
    return repo.save(payment);
  }

  async findOneBy(
    conditions: Partial<PaymentOrmEntity>,
    manager?: any,
  ): Promise<PaymentOrmEntity | null> {
    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    return repo.findOne({ where: conditions, relations: ['customerOrder'] });
  }

  async findById(
    id: number,
    relations: string[] = [],
  ): Promise<PaymentOrmEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations,
    });
  }

  async findByMerchant(
    merchantId: number,
    query: PaymentListQueryDto,
    manager?: EntityManager,
  ) {
    const { page = 1, limit = 10, status, customerOrderId, customerId, paymentDateFrom, paymentDateTo, search, searchField, sort, readAt } = query;

    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    const qb = repo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.customerOrder', 'customerOrder')
      .leftJoinAndSelect('customerOrder.order', 'order')
      .leftJoinAndSelect('customerOrder.customer', 'customer')
      .leftJoinAndSelect('order.merchant', 'merchant')
      .leftJoinAndSelect('payment.paymentProofImage', 'paymentProofImage');

    // ถ้า merchantId > 0 ให้กรองตาม merchant ถ้าเป็น 0 (admin) ดูทั้งหมด
    if (merchantId > 0) {
      qb.where('merchant.id = :merchantId', { merchantId });
    }

    if (status) qb.andWhere('payment.status = :status', { status });
    if (customerOrderId) qb.andWhere('payment.customerOrderId = :customerOrderId', { customerOrderId });
    if (customerId) qb.andWhere('customerOrder.customerId = :customerId', { customerId });
    if (paymentDateFrom) qb.andWhere('payment.paymentDate >= :paymentDateFrom', { paymentDateFrom });
    if (paymentDateTo) qb.andWhere('payment.paymentDate <= :paymentDateTo', { paymentDateTo });
    if (readAt === null) qb.andWhere('payment.readAt IS NULL');
    if (readAt !== null && readAt !== undefined) qb.andWhere('payment.readAt = :readAt', { readAt });

    // ค้นหาจาก customer name หรือ order code
    if (search) {
      qb.andWhere(
        '(customer.customerName LIKE :search OR order.orderCode LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const result = await fetchWithPagination({
      qb,
      sort: sort as SortDirection,
      page,
      limit,
      manager: manager || repo.manager,
    });
    
    return result;
  }

  async findByCustomer(
    customerId: number,
    query: PaymentListQueryDto,
    manager?: EntityManager,
  ) {
    const { page = 1, limit = 10, status, paymentDateFrom, paymentDateTo, search, searchField, sort } = query;

    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    const qb = repo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.customerOrder', 'customerOrder')
      .leftJoinAndSelect('customerOrder.order', 'order')
      .leftJoinAndSelect('customerOrder.customer', 'customer')
      .leftJoinAndSelect('payment.paymentProofImage', 'paymentProofImage')
      .where('customerOrder.customerId = :customerId', { customerId });

    // Apply filters
    if (status) qb.andWhere('payment.status = :status', { status });
    if (paymentDateFrom) qb.andWhere('payment.paymentDate >= :paymentDateFrom', { paymentDateFrom });
    if (paymentDateTo) qb.andWhere('payment.paymentDate <= :paymentDateTo', { paymentDateTo });

    return fetchWithPagination({
      qb,
      sort: sort as SortDirection,
      search: search && searchField ? { kw: search, field: `payment.${searchField}` } : undefined,
      page,
      limit,
      manager: manager || repo.manager,
    });
  }

  async update(
    id: number,
    data: Partial<PaymentOrmEntity>,
    manager?: any,
  ): Promise<PaymentOrmEntity> {
    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    await repo.update(id, data);
    // ใช้ repo เดียวกันเมื่ออยู่ใน transaction เพื่อให้เห็นข้อมูลที่อัปเดตแล้ว
    const updated = manager
      ? await repo.findOne({ where: { id } })
      : await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Payment with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: number, manager?: any): Promise<void> {
    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    await repo.delete(id);
  }

  async getSummaryByMerchant(
    merchantId: number,
    query: PaymentListQueryDto,
    manager?: EntityManager,
  ): Promise<{
    totalPayments: number;
    totalAmount: string;
    totalPending: number;
    totalVerified: number;
    totalRejected: number;
  }> {
    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    const qb = repo.createQueryBuilder('payment')
      .leftJoin('payment.customerOrder', 'customerOrder')
      .leftJoin('customerOrder.order', 'order')
      .leftJoin('customerOrder.customer', 'customer')
      .leftJoin('order.merchant', 'merchant');

    if (merchantId > 0) {
      qb.where('merchant.id = :merchantId', { merchantId });
    }

    const { status, search, paymentDateFrom, paymentDateTo } = query;
    if (status) qb.andWhere('payment.status = :status', { status });
    if (paymentDateFrom) qb.andWhere('payment.paymentDate >= :paymentDateFrom', { paymentDateFrom });
    if (paymentDateTo) qb.andWhere('payment.paymentDate <= :paymentDateTo', { paymentDateTo });
    if (search) {
      qb.andWhere('(customer.customerName LIKE :search OR order.orderCode LIKE :search)', { search: `%${search}%` });
    }

    qb.select('COUNT(payment.id)', 'totalPayments')
      .addSelect('COALESCE(SUM(payment.paymentAmount), 0)', 'totalAmount')
      .addSelect(`SUM(CASE WHEN payment.status = 'PENDING' THEN 1 ELSE 0 END)`, 'totalPending')
      .addSelect(`SUM(CASE WHEN payment.status = 'VERIFIED' THEN 1 ELSE 0 END)`, 'totalVerified')
      .addSelect(`SUM(CASE WHEN payment.status = 'REJECTED' THEN 1 ELSE 0 END)`, 'totalRejected');

    const raw = await qb.getRawOne();
    return {
      totalPayments: Number(raw?.totalPayments ?? 0),
      totalAmount: raw?.totalAmount ?? '0',
      totalPending: Number(raw?.totalPending ?? 0),
      totalVerified: Number(raw?.totalVerified ?? 0),
      totalRejected: Number(raw?.totalRejected ?? 0),
    };
  }

  async findByCustomerOrderId(
    customerOrderId: number,
    relations: string[] = [],
  ): Promise<PaymentOrmEntity | null> {
    return this.repository.findOne({
      where: { customerOrderId },
      relations: ['paymentProofImage', ...relations],
    });
  }
}
