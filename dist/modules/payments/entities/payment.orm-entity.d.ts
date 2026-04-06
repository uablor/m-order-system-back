import { BaseOrmEntity } from '../../../common/base/enities/base.orm-entities';
import { CustomerOrderOrmEntity } from '../../orders/entities/customer-order.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { ImageOrmEntity } from 'src/modules/images/entities/image.orm-entity';
import { PaymentVerificationStatusEnum } from '../enum/payment.enum';
export declare class PaymentOrmEntity extends BaseOrmEntity {
    customerOrder: CustomerOrderOrmEntity;
    customerOrderId: number;
    paymentAmount: number;
    paymentDate: Date;
    paymentProofImage: ImageOrmEntity;
    paymentProofImageId: number | null;
    customerMessage: string;
    status: PaymentVerificationStatusEnum;
    verifiedBy: UserOrmEntity;
    verifiedById: number;
    verifiedAt: Date;
    rejectedBy: UserOrmEntity;
    rejectedById: number;
    rejectedAt: Date;
    rejectReason: string;
    notes: string;
    readAt: Date;
}
