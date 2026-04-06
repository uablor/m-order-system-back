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
exports.NotificationSendService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const notification_repository_1 = require("../repositories/notification.repository");
const facebook_messenger_service_1 = require("./facebook-messenger.service");
function preferredToChannel(pref) {
    if (!pref)
        return null;
    if (pref === 'FACEBOOK')
        return 'FB';
    if (pref === 'LINE')
        return 'LINE';
    if (pref === 'WHATSAPP')
        return 'WHATSAPP';
    return null;
}
function getRecipientContact(customer, channel) {
    switch (channel) {
        case 'FB':
            return customer.contactFacebook ?? '';
        case 'LINE':
            return customer.contactLine ?? '';
        case 'WHATSAPP':
            return customer.contactWhatsapp ?? '';
        default:
            return '';
    }
}
function buildFullUrl(baseUrl, path) {
    const base = (baseUrl ?? '').replace(/\/$/, '');
    const p = (path ?? '').replace(/^\//, '');
    return p ? `${base}/${p}` : base || '';
}
let NotificationSendService = class NotificationSendService {
    notificationRepository;
    facebookMessengerService;
    configService;
    constructor(notificationRepository, facebookMessengerService, configService) {
        this.notificationRepository = notificationRepository;
        this.facebookMessengerService = facebookMessengerService;
        this.configService = configService;
    }
    async sendArrivalNotifications(manager, params) {
        const { merchant, orderId, customers, messageContent, notificationLinkPath } = params;
        const notifications = [];
        for (const customer of customers) {
            const frontendUrl = this.configService.get('FRONTEND_URL', { infer: true }) ??
                `${this.configService.get('FRONTEND_URL', { infer: true })?.replace(/\/$/, '')}/?token=${customer.token}`;
            const fullNotificationLink = buildFullUrl(frontendUrl, notificationLinkPath);
            const channel = preferredToChannel(customer.preferredContactMethod ?? null);
            const recipientContact = channel
                ? getRecipientContact(customer, channel)
                : '';
            let status = 'SENT';
            let errorMessage = null;
            let sentAt = new Date();
            if (!channel || !recipientContact) {
                status = 'FAILED';
                errorMessage = 'No contact channel or recipient contact available';
                sentAt = null;
            }
            else if (channel === 'FB') {
                const messageWithLink = `${messageContent} ดูรายละเอียด: ${fullNotificationLink}`;
                const sendResult = await this.facebookMessengerService.sendMessage(recipientContact, messageWithLink);
                if (!sendResult.success) {
                    status = 'FAILED';
                    errorMessage = sendResult.errorMessage ?? 'Failed to send';
                    sentAt = null;
                }
            }
            try {
                const notification = await this.notificationRepository.create({
                    merchant,
                    customer: { id: customer.id },
                    notificationType: 'ARRIVAL',
                    channel: channel ?? 'FB',
                    recipientContact: recipientContact || 'N/A',
                    messageContent,
                    notificationLink: fullNotificationLink,
                    retryCount: 0,
                    lastRetryAt: null,
                    status,
                    sentAt,
                    errorMessage,
                    relatedOrders: [orderId],
                }, manager);
                notifications.push(notification);
            }
            catch (err) {
                const errMsg = err instanceof Error ? err.message : 'Unknown error';
                const failedNotification = await this.notificationRepository.create({
                    merchant,
                    customer: { id: customer.id },
                    notificationType: 'ARRIVAL',
                    channel: channel ?? 'FB',
                    recipientContact: recipientContact || 'N/A',
                    messageContent,
                    notificationLink: fullNotificationLink,
                    retryCount: 0,
                    lastRetryAt: null,
                    status: 'FAILED',
                    sentAt: null,
                    errorMessage: errMsg,
                    relatedOrders: [orderId],
                }, manager);
                notifications.push(failedNotification);
            }
        }
        return notifications;
    }
};
exports.NotificationSendService = NotificationSendService;
exports.NotificationSendService = NotificationSendService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repository_1.NotificationRepository,
        facebook_messenger_service_1.FacebookMessengerService,
        config_1.ConfigService])
], NotificationSendService);
//# sourceMappingURL=notification-send.service.js.map