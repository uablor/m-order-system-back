import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { swaggerConfig, SWAGGER_PATH } from './common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // เปิด CORS สำหรับตอนพัฒนา frontend (Vite)
  // หมายเหตุ: เราจัดการ preflight (OPTIONS) เองเพื่อกันเคส "Cannot OPTIONS /..." ที่ทำให้ browser block
  // const allowedOrigins = new Set([
  //   'http://localhost:5173',
  //   'http://127.0.0.1:5173',
  // ]);

  // app.use((req: any, res: any, next: any) => {
  //   const origin = req.headers?.origin as string | undefined;
  //   if (origin && allowedOrigins.has(origin)) {
  //     res.setHeader('Access-Control-Allow-Origin', origin);
  //     res.setHeader('Access-Control-Allow-Credentials', 'true');
  //     res.setHeader('Vary', 'Origin');
  //   }

  //   // อนุญาต headers/methods ที่ frontend ใช้
  //   res.setHeader(
  //     'Access-Control-Allow-Methods',
  //     'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   );
  //   res.setHeader(
  //     'Access-Control-Allow-Headers',
  //     'Content-Type, Authorization, X-Correlation-Id',
  //   );

  //   // ตอบ preflight ทันที
  //   if (req.method === 'OPTIONS') {
  //     return res.status(204).end();
  //   }

  //   next();
  // });

  app.enableCors({
    origin: true, // allow all origins
    credentials: true,
  });
  app.useGlobalPipes(

    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  console.log('server runing at port', process.env.PORT)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
