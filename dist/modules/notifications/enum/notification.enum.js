"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationChannel = exports.NotificationType = exports.NotificationStatus = void 0;
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "PENDING";
    NotificationStatus["SENT"] = "SENT";
    NotificationStatus["FAILED"] = "FAILED";
    NotificationStatus["CANCELLED"] = "CANCELLED";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["ARRIVAL"] = "ARRIVAL";
    NotificationType["PAYMENT"] = "PAYMENT";
    NotificationType["REMINDER"] = "REMINDER";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["FB"] = "FB";
    NotificationChannel["LINE"] = "LINE";
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
//# sourceMappingURL=notification.enum.js.map