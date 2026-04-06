"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_query_repository_1 = require("../../../common/base/repositories/base.query-repository");
const notification_orm_entity_1 = require("../entities/notification.orm-entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
let NotificationQueryRepository = class NotificationQueryRepository extends base_query_repository_1.BaseQueryRepository {
    constructor(repository) {
        super(repository);
    }
    async findWithPagination(options, manager) {
        const repo = this.getRepo(manager);
        const qb = repo
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.merchant', 'merchant')
            .leftJoinAndSelect('notification.customer', 'customer');
        if (options.merchantId != null) {
            qb.andWhere('merchant.id = :merchantId', { merchantId: options.merchantId });
        }
        if (options.customerId != null) {
            qb.andWhere('customer.id = :customerId', { customerId: options.customerId });
        }
        if (options.notificationType) {
            qb.andWhere('notification.notificationType = :notificationType', {
                notificationType: options.notificationType,
            });
        }
        if (options.status) {
            qb.andWhere('notification.status = :status', { status: options.status });
        }
        if (options.search) {
            qb.andWhere('(notification.recipientContact LIKE :search OR notification.messageContent LIKE :search)', { search: `%${options.search}%` });
        }
        if (options.startDate) {
            qb.andWhere('DATE(notification.sentAt) >= :startDate', { startDate: options.startDate });
        }
        if (options.endDate) {
            qb.andWhere('DATE(notification.sentAt) <= :endDate', { endDate: options.endDate });
        }
        return (0, pagination_util_1.fetchWithPagination)({
            qb,
            page: options.page ?? 1,
            limit: options.limit ?? 10,
            search: options.search ? { kw: options.search, field: 'recipientContact' } : undefined,
            sort: 'DESC',
            manager: manager || repo.manager,
        });
    }
    async findCustomerOrderBy(id, manager) {
        const repo = this.getRepo(manager);
        return repo.find({
            where: { relatedOrders: (0, typeorm_2.In)(id) },
            relations: ['customer', 'merchant'],
        });
    }
};
exports.NotificationQueryRepository = NotificationQueryRepository;
exports.NotificationQueryRepository = NotificationQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_orm_entity_1.NotificationOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificationQueryRepository);
//# sourceMappingURL=notification.query-repository.js.map