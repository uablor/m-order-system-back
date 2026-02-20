import * as bcrypt from 'bcrypt';
import { hashPassword, comparePassword } from '../../../../src/common/utils/password.util';

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('ควร hash password สำเร็จ', async () => {
      const plain = 'MySecretPassword123';
      const hashed = await hashPassword(plain);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(plain);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('ควรสร้าง hash ที่ต่างกันทุกครั้ง (เพราะ salt)', async () => {
      const plain = 'SamePassword';
      const hash1 = await hashPassword(plain);
      const hash2 = await hashPassword(plain);

      expect(hash1).not.toBe(hash2);
    });

    it('ควรใช้ bcrypt ในการ hash', async () => {
      const plain = 'TestPassword';
      const hashed = await hashPassword(plain);

      const isValid = await bcrypt.compare(plain, hashed);
      expect(isValid).toBe(true);
    });
  });

  describe('comparePassword', () => {
    it('ควร return true เมื่อ password ถูกต้อง', async () => {
      const plain = 'CorrectPassword';
      const hashed = await hashPassword(plain);

      const result = await comparePassword(plain, hashed);
      expect(result).toBe(true);
    });

    it('ควร return false เมื่อ password ไม่ถูกต้อง', async () => {
      const plain = 'CorrectPassword';
      const hashed = await hashPassword(plain);

      const result = await comparePassword('WrongPassword', hashed);
      expect(result).toBe(false);
    });

    it('ควร return false เมื่อ hash ว่างเปล่า', async () => {
      const result = await comparePassword('any', '');
      expect(result).toBe(false);
    });
  });
});
