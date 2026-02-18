import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  // หมายเหตุ:
  // - ถ้าไม่ได้ตั้ง REDIS_HOST/REDIS_URL ให้ใช้ in-memory cache แทน
  // - จะช่วยกันอาการ GET ค้างเมื่อไม่มี Redis server ในเครื่อง
  host: process.env.REDIS_HOST ?? undefined,
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  password: process.env.REDIS_PASSWORD ?? undefined,
  url: process.env.REDIS_URL ?? undefined,
}));
