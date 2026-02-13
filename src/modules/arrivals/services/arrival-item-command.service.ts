import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { ArrivalItemRepository } from '../repositories/arrival-item.repository';
import { ArrivalItemUpdateDto } from '../dto/arrival-item-update.dto';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';

@Injectable()
export class ArrivalItemCommandService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly arrivalItemRepository: ArrivalItemRepository,
  ) {}

  async update(id: number, dto: ArrivalItemUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.arrivalItemRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Arrival item not found');
      const updateData: Partial<ArrivalItemOrmEntity> = {};
      if (dto.arrivedQuantity !== undefined) updateData.arrivedQuantity = dto.arrivedQuantity;
      if (dto.condition !== undefined) updateData.condition = dto.condition ?? null;
      if (dto.notes !== undefined) updateData.notes = dto.notes ?? null;
      await this.arrivalItemRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.arrivalItemRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Arrival item not found');
      await this.arrivalItemRepository.delete(id, manager);
    });
  }
}
