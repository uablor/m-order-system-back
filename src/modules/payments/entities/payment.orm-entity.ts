import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { CustomerOrderOrmEntity } from '../../orders/entities/customer-order.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { ImageOrmEntity } from 'src/modules/images/entities/image.orm-entity';

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

@Entity('payments')
export class PaymentOrmEntity extends BaseOrmEntity {
  @ManyToOne(() => CustomerOrderOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_order_id' })
  customerOrder: CustomerOrderOrmEntity;

  @Column({ name: 'customer_order_id' })
  customerOrderId: number;

  @Column({ name: 'payment_amount', type: 'decimal', precision: 18, scale: 2 })
  paymentAmount: number;

  @Column({ name: 'payment_date', type: 'timestamp', nullable: true })
  paymentDate: Date;

  @ManyToOne(() => ImageOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'payment_proof_image_id' })
  paymentProofImage: ImageOrmEntity;

  @Column({ name: 'payment_proof_image_id', nullable: true })
  paymentProofImageId: number | null;

  @Column({ name: 'customer_message', type: 'text', nullable: true })
  customerMessage: string;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'PENDING' })
  status: PaymentStatus;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifiedBy: UserOrmEntity;

  @Column({ name: 'verified_by', nullable: true })
  verifiedById: number;

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'rejected_by' })
  rejectedBy: UserOrmEntity;

  @Column({ name: 'rejected_by', nullable: true })
  rejectedById: number;

  @Column({ name: 'rejected_at', type: 'timestamp', nullable: true })
  rejectedAt: Date;

  @Column({ name: 'reject_reason', type: 'text', nullable: true })
  rejectReason: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;
}
