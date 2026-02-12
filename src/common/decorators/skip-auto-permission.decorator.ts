import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTO_PERMISSION_KEY = 'skipAutoPermission';

export const SkipAutoPermission = () =>
  SetMetadata(SKIP_AUTO_PERMISSION_KEY, true);
