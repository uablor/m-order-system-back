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
exports.ArrivalItemOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const base_orm_entities_1 = require("../../../common/base/enities/base.orm-entities");
const arrival_orm_entity_1 = require("./arrival.orm-entity");
const order_item_orm_entity_1 = require("../../orders/entities/order-item.orm-entity");
let ArrivalItemOrmEntity = class ArrivalItemOrmEntity extends base_orm_entities_1.BaseOrmEntity {
    arrival;
    orderItem;
    arrivedQuantity;
    condition;
    notes;
};
exports.ArrivalItemOrmEntity = ArrivalItemOrmEntity;
__decorate([
    (0, typeorm_1.ManyToOne)(() => arrival_orm_entity_1.ArrivalOrmEntity, (a) => a.arrivalItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'arrival_id' }),
    __metadata("design:type", arrival_orm_entity_1.ArrivalOrmEntity)
], ArrivalItemOrmEntity.prototype, "arrival", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_item_orm_entity_1.OrderItemOrmEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_item_id' }),
    __metadata("design:type", order_item_orm_entity_1.OrderItemOrmEntity)
], ArrivalItemOrmEntity.prototype, "orderItem", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'arrived_quantity', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ArrivalItemOrmEntity.prototype, "arrivedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], ArrivalItemOrmEntity.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ArrivalItemOrmEntity.prototype, "notes", void 0);
exports.ArrivalItemOrmEntity = ArrivalItemOrmEntity = __decorate([
    (0, typeorm_1.Entity)('arrival_items')
], ArrivalItemOrmEntity);
//# sourceMappingURL=arrival-item.orm-entity.js.map