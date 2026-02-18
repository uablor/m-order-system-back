# m-order-system-back API Analysis

เอกสารนี้สรุปจำนวน API และภาพรวมการทำงานของระบบ `m-order-system-back` จากโค้ดปัจจุบัน

## ภาพรวมเร็วๆ

- จำนวน endpoints ทั้งหมด: **57**
- จำนวน controllers: **14**
- Global prefix: **ไม่มี** (ไม่ได้ตั้ง `app.setGlobalPrefix`)
- Swagger docs: **`/docs`**
- Auth โดยรวม: ใช้ `JwtAuthGuard` แบบ global guard (ยกเว้น endpoint ที่มี `@Public()`)

## จำนวน API แยกตามโมดูล

| Module | Base Path | Count |
|---|---|---:|
| Auth | `/auth` | 2 |
| Users | `/users` | 6 |
| Roles | `/roles` | 5 |
| Permissions | `/permissions` | 6 |
| Role Permissions | `/role-permissions` | 3 |
| Orders | `/orders` | 6 |
| Order Items | `/order-items` | 2 |
| Customer Orders | `/customer-orders` | 2 |
| Customer Order Items | `/customer-order-items` | 2 |
| Merchants | `/merchants` | 5 |
| Customers | `/customers` | 5 |
| Arrivals | `/arrivals` | 5 |
| Arrival Items | `/arrival-items` | 4 |
| Notifications | `/notifications` | 4 |
| **Total** |  | **57** |

## รายการ Endpoints ทั้งหมด

### Auth (`/auth`)

- `POST /auth/login` -> `login()` (Public)
- `GET /auth/me` -> `me()`

### Users (`/users`)

- `POST /users` -> `create()`
- `POST /users/user-merchant` -> `createUserWithMerchant()`
- `GET /users/:id` -> `getById()`
- `GET /users` -> `getList()`
- `PATCH /users/:id` -> `update()`
- `DELETE /users/:id` -> `delete()`

### Roles (`/roles`)

- `POST /roles` -> `create()`
- `GET /roles/:id` -> `getById()`
- `GET /roles` -> `getList()`
- `PATCH /roles/:id` -> `update()`
- `DELETE /roles/:id` -> `delete()`

### Permissions (`/permissions`)

- `POST /permissions/generate` -> `generateFromControllers()`
- `POST /permissions` -> `create()`
- `GET /permissions/:id` -> `getById()`
- `GET /permissions` -> `getList()`
- `PATCH /permissions/:id` -> `update()`
- `DELETE /permissions/:id` -> `delete()`

### Role Permissions (`/role-permissions`)

- `POST /role-permissions/assign` -> `assign()`
- `DELETE /role-permissions/:roleId/:permissionId` -> `unassign()`
- `GET /role-permissions/role/:roleId` -> `getByRoleId()`

### Orders (`/orders`)

- `POST /orders/create-full` -> `createFull()`
- `POST /orders` -> `create()`
- `GET /orders` -> `getList()`
- `GET /orders/:id` -> `getById()`
- `PATCH /orders/:id` -> `update()`
- `DELETE /orders/:id` -> `delete()`

### Order Items (`/order-items`)

- `GET /order-items` -> `getList()`
- `GET /order-items/:id` -> `getById()`

### Customer Orders (`/customer-orders`)

- `GET /customer-orders` -> `getList()`
- `GET /customer-orders/:id` -> `getById()`

### Customer Order Items (`/customer-order-items`)

- `GET /customer-order-items` -> `getList()`
- `GET /customer-order-items/:id` -> `getById()`

### Merchants (`/merchants`)

- `POST /merchants` -> `create()`
- `GET /merchants/:id` -> `getById()`
- `GET /merchants` -> `getList()`
- `PATCH /merchants/:id` -> `update()`
- `DELETE /merchants/:id` -> `delete()`

### Customers (`/customers`)

- `POST /customers` -> `create()`
- `GET /customers/:id` -> `getById()`
- `GET /customers` -> `getList()`
- `PATCH /customers/:id` -> `update()`
- `DELETE /customers/:id` -> `delete()`

### Arrivals (`/arrivals`)

- `POST /arrivals/create` -> `create()`
- `GET /arrivals` -> `getList()`
- `GET /arrivals/:id` -> `getById()`
- `PATCH /arrivals/:id` -> `update()`
- `DELETE /arrivals/:id` -> `delete()`

### Arrival Items (`/arrival-items`)

- `GET /arrival-items` -> `getList()`
- `GET /arrival-items/:id` -> `getById()`
- `PATCH /arrival-items/:id` -> `update()`
- `DELETE /arrival-items/:id` -> `delete()`

### Notifications (`/notifications`)

- `GET /notifications` -> `getList()`
- `GET /notifications/:id` -> `getById()`
- `PATCH /notifications/:id` -> `update()`
- `DELETE /notifications/:id` -> `delete()`

## ระบบทำงานอย่างไร (How it works)

## 1) Bootstrap

เมื่อเริ่มระบบจาก `src/main.ts`:

1. สร้างแอปจาก `AppModule`
2. เปิด `ValidationPipe` แบบ global (`whitelist`, `transform`, `forbidNonWhitelisted`)
3. เปิด Swagger ที่ path `/docs`
4. เริ่ม listen ที่ `process.env.PORT` (default `3000`)

## 2) Module และ Global Providers

ใน `src/app.module.ts` มีแกนหลักดังนี้:

- `ConfigModule` (global)
- `TypeOrmModule` (เชื่อมฐานข้อมูลจาก config)
- `ThrottlerModule` (rate limit)
- `CacheModule` (รองรับ Redis ถ้ามี config)
- `Auth/User/Role/Permission/Order/Arrival/...` modules

และมี global providers:

- `APP_GUARD` -> `ThrottlerGuard`
- `APP_GUARD` -> `JwtAuthGuard`
- `APP_INTERCEPTOR` -> `CacheInterceptor`
- `APP_FILTER` -> `AllExceptionsFilter`

## 3) Authentication/Authorization

- `JwtAuthGuard` ถูกผูกเป็น global guard  
  - ถ้า endpoint มี `@Public()` จะข้ามการเช็ก token
  - ถ้าไม่มี token หรือ token ไม่ถูกต้อง จะ `UnauthorizedException`
- `RolesGuard` ถูกใช้เฉพาะบาง controller/route ร่วมกับ `@Roles(...)`

## 4) Request Flow

ภาพรวมการไหลของ request:

`Client Request -> Global Guards (Throttle + JWT) -> RolesGuard (ถ้ามี) -> Controller -> Command/Query Service -> Repository/TypeORM -> MySQL -> Response`

แนวทางที่ใช้ในหลายโมดูล:

- แยกบริการอ่าน/เขียน (`QueryService` / `CommandService`)
- ใช้ DTO + ValidationPipe เพื่อคุมรูปแบบข้อมูล
- ใช้ TypeORM และ migration สำหรับ schema

## หมายเหตุสำคัญ

- Endpoint ที่ public จากโค้ดปัจจุบัน: `POST /auth/login`
- ใน `UserController` มีเมธอดที่ยังไม่ผูก route (`SuperAdmin`, `Admin`, `AdminMerchant`, `EmployeeMerchant`) จึง **ไม่ถูกนับเป็น API**
