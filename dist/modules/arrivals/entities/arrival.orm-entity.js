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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrivalOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const order_orm_entity_1 = require("../../orders/entities/order.orm-entity");
const merchant_orm_entity_1 = require("../../merchants/entities/merchant.orm-entity");
const user_orm_entity_1 = require("../../users/entities/user.orm-entity");
const arrival_item_orm_entity_1 = require("./arrival-item.orm-entity");
let ArrivalOrmEntity = class ArrivalOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    order;
    merchant;
    arrivedDate;
    arrivedTime;
    recordedByUser;
    notes;
    arrivalItems;
};
exports.ArrivalOrmEntity = ArrivalOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_orm_entity_1.OrderOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_orm_entity_1.OrderOrmEntity)
], ArrivalOrmEntity.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => merchant_orm_entity_1.MerchantOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'merchant_id' }),
    __metadata("design:type", merchant_orm_entity_1.MerchantOrmEntity)
], ArrivalOrmEntity.prototype, "merchant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arrived_date', type: 'date' }),
    __metadata("design:type", Date)
], ArrivalOrmEntity.prototype, "arrivedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arrived_time', type: 'time' }),
    __metadata("design:type", String)
], ArrivalOrmEntity.prototype, "arrivedTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_orm_entity_1.UserOrmEntity, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'recorded_by' }),
    __metadata("design:type", Object)
], ArrivalOrmEntity.prototype, "recordedByUser", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ArrivalOrmEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => arrival_item_orm_entity_1.ArrivalItemOrmEntity, (ai) => ai.arrival),
    __metadata("design:type", Array)
], ArrivalOrmEntity.prototype, "arrivalItems", void 0);
exports.ArrivalOrmEntity = ArrivalOrmEntity = __decorate([
    (0, typeorm_1.Entity)('arrivals')
], ArrivalOrmEntity);
//# sourceMappingURL=arrival.orm-entity.js.map