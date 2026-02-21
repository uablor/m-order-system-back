import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, EntityManager } from 'typeorm';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { SortDirection } from '../../../common/base/enums/base.query.enum';

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
    query: { page?: number; limit?: number; status?: string; customerOrderId?: number; customerId?: number; paymentDateFrom?: Date; paymentDateTo?: Date; search?: string; searchField?: string; sort?: string },
    manager?: EntityManager,
  ) {
    const { page = 1, limit = 10, status, customerOrderId, customerId, paymentDateFrom, paymentDateTo, search, searchField, sort } = query;

    let queryBuilder: SelectQueryBuilder<PaymentOrmEntity> = this.repository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.customerOrder', 'customerOrder')
      .leftJoinAndSelect('customerOrder.order', 'order')
      .leftJoinAndSelect('customerOrder.customer', 'customer')
      .where('order.merchantId = :merchantId', { merchantId });

    if (status) {
      queryBuilder = queryBuilder.andWhere('payment.status = :status', { status });
    }

    if (customerOrderId) {
      queryBuilder = queryBuilder.andWhere('payment.customerOrderId = :customerOrderId', {
        customerOrderId,
      });
    }

    if (customerId) {
      queryBuilder = queryBuilder.andWhere('customerOrder.customerId = :customerId', {
        customerId,
      });
    }

    if (paymentDateFrom) {
      queryBuilder = queryBuilder.andWhere('payment.paymentDate >= :paymentDateFrom', {
        paymentDateFrom,
      });
    }

    if (paymentDateTo) {
      queryBuilder = queryBuilder.andWhere('payment.paymentDate <= :paymentDateTo', {
        paymentDateTo,
      });
    }

    // Use pagination utility
    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    const qb = repo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.customerOrder', 'customerOrder')
      .leftJoinAndSelect('customerOrder.order', 'order')
      .leftJoinAndSelect('customerOrder.customer', 'customer')
      .where('order.merchantId = :merchantId', { merchantId });

    // Apply filters
    if (status) qb.andWhere('payment.status = :status', { status });
    if (customerOrderId) qb.andWhere('payment.customerOrderId = :customerOrderId', { customerOrderId });
    if (customerId) qb.andWhere('customerOrder.customerId = :customerId', { customerId });
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

  async findByCustomer(
    customerId: number,
    query: { page?: number; limit?: number; status?: string; paymentDateFrom?: Date; paymentDateTo?: Date; search?: string; searchField?: string; sort?: string },
    manager?: EntityManager,
  ) {
    const { page = 1, limit = 10, status, paymentDateFrom, paymentDateTo, search, searchField, sort } = query;

    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    const qb = repo.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.customerOrder', 'customerOrder')
      .leftJoinAndSelect('customerOrder.order', 'order')
      .leftJoinAndSelect('customerOrder.customer', 'customer')
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
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Payment with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: number, manager?: any): Promise<void> {
    const repo = manager ? manager.getRepository(PaymentOrmEntity) : this.repository;
    await repo.delete(id);
  }
}
