import { ConfigService } from '@nestjs/config';
export interface SendMessageResult {
    success: boolean;
    errorMessage?: string | null;
}
export declare class FacebookMessengerService {
    private readonly configService;
    constructor(configService: ConfigService);
    sendMessage(psid: string, text: string): Promise<SendMessageResult>;
}
