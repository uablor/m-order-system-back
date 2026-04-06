"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentVerificationStatusEnum = exports.PaymentStatusEnum = void 0;
var PaymentStatusEnum;
(function (PaymentStatusEnum) {
    PaymentStatusEnum["NOT_CREATED"] = "NOT_CREATED";
    PaymentStatusEnum["UNPAID"] = "UNPAID";
    PaymentStatusEnum["PAID"] = "PAID";
})(PaymentStatusEnum || (exports.PaymentStatusEnum = PaymentStatusEnum = {}));
var PaymentVerificationStatusEnum;
(function (PaymentVerificationStatusEnum) {
    PaymentVerificationStatusEnum["PENDING"] = "PENDING";
    PaymentVerificationStatusEnum["VERIFIED"] = "VERIFIED";
    PaymentVerificationStatusEnum["REJECTED"] = "REJECTED";
})(PaymentVerificationStatusEnum || (exports.PaymentVerificationStatusEnum = PaymentVerificationStatusEnum = {}));
//# sourceMappingURL=payment.enum.js.map