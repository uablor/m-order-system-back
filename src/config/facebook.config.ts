import { registerAs } from '@nestjs/config';

export default registerAs('facebook', () => ({
  messenger: {
    token: process.env.FACEBOOK_MESSENGER_TOKEN ?? '',
  },
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
}));
