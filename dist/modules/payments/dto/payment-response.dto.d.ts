export declare class PaymentResponseDto {
    id: number;
    customerOrderId: number;
    paymentAmount: number;
    paymentDate: Date;
    paymentProofUrl: string;
    customerMessage: string;
    status: string;
    verifiedById: number;
    verifiedAt: Date;
    rejectedById: number;
    rejectedAt: Date;
    rejectReason: string;
    notes: string;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
