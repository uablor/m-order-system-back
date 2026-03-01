import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { CustomerOrderOrmEntity } from '../../orders/entities/customer-order.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';

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

  @Column({ name: 'payment_proof_url', type: 'text', nullable: true })
  paymentProofUrl: string;

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
