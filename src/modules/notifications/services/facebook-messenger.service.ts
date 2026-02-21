import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const MESSENGER_SEND_URL = 'https://graph.facebook.com/v21.0/me/messages';

export interface SendMessageResult {
  success: boolean;
  errorMessage?: string | null;
}

@Injectable()
export class FacebookMessengerService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Send a text message (with optional link in text) to a recipient via Facebook Messenger.
   * @param psid - Page-Scoped User ID (recipient), from customer.contact_facebook
   * @param text - Message text; can include full URL for the link
   * @returns Result with success flag and optional error message
   */
  async sendMessage(psid: string, text: string): Promise<SendMessageResult> {
    const token = this.configService.get<string>(
      'facebook.messenger.token',
      { infer: true },
    );
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
      const data = (await res.json().catch(() => ({}))) as {
        error?: { message?: string; code?: number };
      };

      if (!res.ok) {
        const errMsg =
          data?.error?.message ?? `HTTP ${res.status} ${res.statusText}`;
        return { success: false, errorMessage: errMsg };
      }
      if (data?.error) {
        return {
          success: false,
          errorMessage: data.error.message ?? 'Unknown API error',
        };
      }
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error sending message';
      return { success: false, errorMessage };
    }
  }
}
