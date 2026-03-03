import { randomBytes } from "crypto";

export function generateUniqueToken(): string {
  return randomBytes(24).toString('base64url');
}