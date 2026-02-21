import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationUpdateDto } from '../dto/notification-update.dto';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';

@Injectable()
export class NotificationCommandService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async update(id: number, dto: NotificationUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.notificationRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Notification not found');
      const updateData: Partial<NotificationOrmEntity> = {};
      if (dto.status !== undefined) updateData.status = dto.status;
      if (dto.retryCount !== undefined) updateData.retryCount = dto.retryCount;
      if (dto.lastRetryAt !== undefined)
        updateData.lastRetryAt = dto.lastRetryAt ? new Date(dto.lastRetryAt) : null;
      if (dto.sentAt !== undefined) updateData.sentAt = dto.sentAt ? new Date(dto.sentAt) : null;
      if (dto.errorMessage !== undefined) updateData.errorMessage = dto.errorMessage ?? null;
      await this.notificationRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.notificationRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Notification not found');
      await this.notificationRepository.delete(id, manager);
    });
  }
}
