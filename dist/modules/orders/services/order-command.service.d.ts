import { TransactionService } from '../../../common/transaction/transaction.service';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemSkuRepository } from '../repositories/order-item-sku.repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderItemRepository } from '../repositories/customer-order-item.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { CustomerRepository } from '../../customers/repositories/customer.repository';
import { ExchangeRateQueryRepository } from '../../exchange-rates/repositories/exchange-rate.query-repository';
import { CreateFullOrderDto } from '../dto/create-full-order.dto';
import { OrderCreateDto } from '../dto/order-create.dto';
import { OrderUpdateDto } from '../dto/order-update.dto';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class OrderCommandService {
    private readonly transactionService;
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly orderItemSkuRepository;
    private readonly customerOrderRepository;
    private readonly customerOrderItemRepository;
    private readonly merchantRepository;
    private readonly customerRepository;
    private readonly exchangeRateQueryRepository;
    constructor(transactionService: TransactionService, orderRepository: OrderRepository, orderItemRepository: OrderItemRepository, orderItemSkuRepository: OrderItemSkuRepository, customerOrderRepository: CustomerOrderRepository, customerOrderItemRepository: CustomerOrderItemRepository, merchantRepository: MerchantRepository, customerRepository: CustomerRepository, exchangeRateQueryRepository: ExchangeRateQueryRepository);
    create(dto: OrderCreateDto, createdByUserId: number | null): Promise<{
        id: number;
    }>;
    update(id: number, dto: OrderUpdateDto): Promise<void>;
    delete(id: number): Promise<void>;
    createFull(dto: CreateFullOrderDto, currentUser: CurrentUserPayload): Promise<{
        success: true;
        order: object;
        message: string;
    }>;
}
