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
exports.ArrivalItemCommandService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../../../common/transaction/transaction.service");
const arrival_item_repository_1 = require("../repositories/arrival-item.repository");
let ArrivalItemCommandService = class ArrivalItemCommandService {
    transactionService;
    arrivalItemRepository;
    constructor(transactionService, arrivalItemRepository) {
        this.transactionService = transactionService;
        this.arrivalItemRepository = arrivalItemRepository;
    }
    async update(id, dto) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.arrivalItemRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Arrival item not found');
            const updateData = {};
            if (dto.arrivedQuantity !== undefined)
                updateData.arrivedQuantity = dto.arrivedQuantity;
            if (dto.condition !== undefined)
                updateData.condition = dto.condition ?? null;
            if (dto.notes !== undefined)
                updateData.notes = dto.notes ?? null;
            await this.arrivalItemRepository.update(id, updateData, manager);
        });
    }
    async delete(id) {
        await this.transactionService.run(async (manager) => {
            const existing = await this.arrivalItemRepository.findOneById(id, manager);
            if (!existing)
                throw new common_1.NotFoundException('Arrival item not found');
            await this.arrivalItemRepository.delete(id, manager);
        });
    }
};
exports.ArrivalItemCommandService = ArrivalItemCommandService;
exports.ArrivalItemCommandService = ArrivalItemCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        arrival_item_repository_1.ArrivalItemRepository])
], ArrivalItemCommandService);
//# sourceMappingURL=arrival-item-command.service.js.map