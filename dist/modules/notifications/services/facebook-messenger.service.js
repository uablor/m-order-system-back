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
exports.FacebookMessengerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const MESSENGER_SEND_URL = 'https://graph.facebook.com/v21.0/me/messages';
let FacebookMessengerService = class FacebookMessengerService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async sendMessage(psid, text) {
        const token = this.configService.get('facebook.messenger.token', { infer: true });
        if (!token?.trim()) {
            return {
                success: false,
                errorMessage: 'Facebook Messenger token is not configured',
            };
        }
        if (!psid?.trim()) {
            return {
                success: false,
                errorMessage: 'Recipient PSID is required',
            };
        }
        const body = {
            recipient: { id: psid.trim() },
            messaging_type: 'MESSAGE_TAG',
            tag: 'CONFIRMED_EVENT_UPDATE',
            message: { text: text.trim() },
        };
        try {
            const url = `${MESSENGER_SEND_URL}?access_token=${encodeURIComponent(token)}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = (await res.json().catch(() => ({})));
            if (!res.ok) {
                const errMsg = data?.error?.message ?? `HTTP ${res.status} ${res.statusText}`;
                return { success: false, errorMessage: errMsg };
            }
            if (data?.error) {
                return {
                    success: false,
                    errorMessage: data.error.message ?? 'Unknown API error',
                };
            }
            return { success: true };
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error sending message';
            return { success: false, errorMessage };
        }
    }
};
exports.FacebookMessengerService = FacebookMessengerService;
exports.FacebookMessengerService = FacebookMessengerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FacebookMessengerService);
//# sourceMappingURL=facebook-messenger.service.js.map