# เอกสารสรุป API Backend (m-order-system-back)

เอกสารนี้อธิบายจำนวน API ทั้งหมด การทำงานโดยย่อ และการแบ่งส่วนสำหรับ **Super Admin** กับ **Merchant/User** (ไม่แก้ไขหรือลบไฟล์ BACKEND_API_ANALYSIS.md)

---

## สรุปจำนวน API ทั้งหมด

| กลุ่ม (Module) | จำนวน Endpoint | หมายเหตุ |
|----------------|----------------|----------|
| Auth | 2 | ล็อกอิน + ดึงโปรไฟล์ |
| Dashboard | 4 | สรุปภาพรวม Admin + Merchant |
| Users | 11 | จัดการผู้ใช้ + สร้าง user-merchant |
| Roles | 5 | จัดการบทบาท (ใช้กับ Super Admin) |
| Permissions | 6 | จัดการสิทธิ์ (รวม generate) |
| Role-Permissions | 3 | ผูกสิทธิ์กับบทบาท |
| Merchants | 8 | จัดการร้านค้า (รวม detail endpoint) |
| Customers | 6 | จัดการลูกค้า |
| Exchange Rates | 10 | อัตราแลกเปลี่ยน |
| Orders | 6 | คำสั่งซื้อ |
| Order Items | 2 | รายการในออเดอร์ |
| Customer Orders | 2 | ออเดอร์ต่อลูกค้า |
| Customer Order Items | 2 | รายการออเดอร์ต่อลูกค้า |
| Arrivals | 5 | การมาถึงของสินค้า |
| Arrival Items | 5 | รายการการมาถึง |
| Notifications | 4 | การแจ้งเตือน |
| App (root) | 1 | ตรวจสอบว่า server ทำงาน |
| **รวม** | **82** | |

---

## ส่วนที่ใช้กับ Super Admin (ผู้ดูแลระบบสูงสุด)

Super Admin ใช้ API เหล่านี้เพื่อจัดการทั้งระบบ ไม่ผูกกับร้านใดร้านหนึ่ง

### 1. Auth — `/auth`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/auth/login` | ล็อกอินด้วยอีเมล/รหัสผ่าน (Public) |
| GET | `/auth/me` | ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่ (Bearer token) |

### 2. Dashboard (ส่วนของ Admin) — `/dashboard`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/dashboard/admin` | สรุปภาพรวมทั้งระบบ (ทุก merchant) เช่น ยอดรวมออเดอร์, สถานะการมาถึง, สถานะการชำระเงิน |
| GET | `/dashboard/admin/annual-report` | รายงานรายปีทั้งระบบ (เลือกปีจาก query: year) |

### 3. Users — `/users`
| Method | Path | การทำงาน | หมายเหตุ |
|--------|------|-----------|----------|
| POST | `/users` | สร้างผู้ใช้ใหม่ | Super Admin |
| POST | `/users/user-merchant` | สร้างผู้ใช้พร้อมร้านค้า (user + merchant) | Super Admin |
| GET | `/users` | รายการผู้ใช้แบบแบ่งหน้า (page, limit, search) | Super Admin |
| GET | `/users/:id` | ดึงผู้ใช้ตาม ID | ทั้ง Admin / Merchant |
| PATCH | `/users/:id` | แก้ไขผู้ใช้ตาม ID | Super Admin |
| PATCH | `/users/:id/active` | เปิด/ปิดสถานะผู้ใช้ | Super Admin |
| PATCH | `/users/:id/change-password-by-id` | เปลี่ยนรหัสผ่านผู้ใช้ตาม ID | Super Admin |
| DELETE | `/users/:id` | ลบผู้ใช้ | Super Admin |

### 4. Roles — `/roles`
ใช้กับ Super Admin เท่านั้น (มี `@UseGuards(RolesGuard)` และ `@Roles(ADMIN_ROLE)` บาง route)

| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/roles` | สร้างบทบาท (ADMIN only) |
| GET | `/roles` | รายการบทบาทแบบแบ่งหน้า |
| GET | `/roles/:id` | ดึงบทบาทตาม ID |
| PATCH | `/roles/:id` | แก้ไขบทบาท |
| DELETE | `/roles/:id` | ลบบทบาท |

### 5. Permissions — `/permissions`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/permissions/generate` | สร้าง permission จากชื่อ controller/method (ADMIN only) |
| POST | `/permissions` | สร้างสิทธิ์ใหม่ |
| GET | `/permissions` | รายการสิทธิ์แบบแบ่งหน้า |
| GET | `/permissions/:id` | ดึงสิทธิ์ตาม ID |
| PATCH | `/permissions/:id` | แก้ไขสิทธิ์ |
| DELETE | `/permissions/:id` | ลบสิทธิ์ |

### 6. Role-Permissions — `/role-permissions`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/role-permissions/assign` | ผูกสิทธิ์ให้บทบาท (ADMIN only) |
| DELETE | `/role-permissions/:roleId/:permissionId` | ยกเลิกการผูกสิทธิ์จากบทบาท |
| GET | `/role-permissions/role/:roleId` | รายการสิทธิ์ของบทบาทตาม roleId |

### 7. Merchants (ส่วนที่ Super Admin ใช้) — `/merchants`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/merchants` | รายการร้านค้าทั้งหมดแบบแบ่งหน้า |
| GET | `/merchants/:id` | ดึงร้านค้าตาม ID (ข้อมูลร้านค้าเบื้องต้น) |
| GET | `/merchants/:id/detail` | ดึงรายละเอียดร้านค้าแบบเต็ม (join users + customers + summary) |
| PATCH | `/merchants/:id` | แก้ไขร้านค้าตาม ID |
| DELETE | `/merchants/:id` | ลบร้านค้า |

### 8. Customers (ส่วนที่ Super Admin ใช้) — `/customers`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/customers` | รายการลูกค้าทั้งหมด (เลือก filter ตาม merchantId ได้) |
| GET | `/customers/:id` | ดึงลูกค้าตาม ID |
| PATCH | `/customers/:id` | แก้ไขลูกค้า |
| DELETE | `/customers/:id` | ลบลูกค้า |

### 9. Exchange Rates (ส่วนที่ Super Admin ใช้) — `/exchange-rates`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/exchange-rates` | รายการอัตราแลกเปลี่ยนแบบแบ่งหน้า (ทุก merchant) |
| GET | `/exchange-rates/:id` | ดึงอัตราแลกเปลี่ยนตาม ID |
| PATCH | `/exchange-rates/:id` | แก้ไขอัตราแลกเปลี่ยน |
| DELETE | `/exchange-rates/:id` | ลบอัตราแลกเปลี่ยน |

### 10. Orders, Order Items, Customer Orders, Customer Order Items
Super Admin สามารถเรียก GET list / GET by id / PATCH / DELETE ได้ตามสิทธิ์ที่กำหนดไว้ในระบบ (ใช้ร่วมกับ permission/role)

### 11. Arrivals, Arrival Items, Notifications
ใช้จัดการข้อมูลการมาถึงของสินค้าและการแจ้งเตือนได้ทั้งระบบ

---

## ส่วนที่ใช้กับ Merchant / User (ร้านค้า หรือผู้ใช้ทั่วไป)

API ในส่วนนี้ใช้ **CurrentUser** (JWT) เพื่อดึง `merchantId` หรือ `userId` แล้วกรอง/บันทึกข้อมูลเฉพาะของร้านหรือของตัวเอง

### 1. Users (ส่วนของ Merchant/User)
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/users/by-merchant` | รายการผู้ใช้ของร้าน (ตาม merchant จาก token) |
| PATCH | `/users/profile` | แก้ไขโปรไฟล์ตัวเอง |
| PATCH | `/users/change-password-user` | เปลี่ยนรหัสผ่านตัวเอง |

### 2. Dashboard (ส่วนของ Merchant) — `/dashboard`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/dashboard/merchant` | สรุปภาพรวมร้านของตัวเอง (กรองด้วย merchantId จาก JWT อัตโนมัติ) เช่น ยอดออเดอร์, สถานะการมาถึง, สถานะการชำระเงิน |
| GET | `/dashboard/merchant/annual-report` | รายงานรายปีของร้าน (เลือกปีจาก query: year) กรองด้วย merchantId จาก JWT อัตโนมัติ |

### 3. Merchants (ส่วนของ Merchant) — `/merchants`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/merchants` | สร้างร้านค้า (ผูกกับ current user) |
| GET | `/merchants/merchant-detail` | ดึงรายละเอียดร้านของตัวเอง (ตาม userId จาก token) |
| PATCH | `/merchants/my-merchant` | แก้ไขร้านของตัวเอง |

### 4. Customers (ส่วนของ Merchant) — `/customers`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/customers` | สร้างลูกค้า (มักผูกกับ merchant จาก token) |
| GET | `/customers/by-merchant` | รายการลูกค้าของร้าน (ตาม merchant จาก token) |

### 5. Exchange Rates (ส่วนของ Merchant) — `/exchange-rates`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/exchange-rates` | สร้างอัตราแลกเปลี่ยนของร้าน |
| POST | `/exchange-rates/bulk` | สร้างอัตราแลกเปลี่ยนหลายรายการ (เช่น BUY + SELL) |
| GET | `/exchange-rates/by-merchant` | รายการอัตราแลกเปลี่ยนของร้าน |
| GET | `/exchange-rates/today` | อัตราวันนี้ (BUY/SELL) ของร้าน จาก token |
| PATCH | `/exchange-rates/:id/by-merchant` | แก้ไขอัตราของร้าน (ตรวจสิทธิ์ตาม merchant) |

### 6. Orders (ส่วนของ Merchant) — `/orders`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/orders/create-full` | สร้างออเดอร์เต็ม (ออเดอร์ + รายการ + customer orders) ในครั้งเดียว |
| POST | `/orders` | สร้างออเดอร์ (ส่วนหัวเท่านั้น) |
| GET | `/orders` | รายการออเดอร์ (มักกรองตาม merchant ใน service) |
| GET | `/orders/:id` | ดึงออเดอร์ตาม ID |
| PATCH | `/orders/:id` | แก้ไขออเดอร์ |
| DELETE | `/orders/:id` | ลบออเดอร์ |

### 7. Order Items — `/order-items`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/order-items` | รายการ order item (filter ตาม orderId ได้) |
| GET | `/order-items/:id` | ดึง order item ตาม ID |

### 8. Customer Orders — `/customer-orders`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/customer-orders` | รายการ customer order (filter ตาม orderId, customerId ได้) |
| GET | `/customer-orders/:id` | ดึง customer order ตาม ID |

### 9. Customer Order Items — `/customer-order-items`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/customer-order-items` | รายการ customer order item |
| GET | `/customer-order-items/:id` | ดึง customer order item ตาม ID |

### 10. Arrivals (ส่วนของ Merchant) — `/arrivals`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/arrivals/create` | บันทึกการมาถึง สร้าง arrival items อัปเดตสต็อก และส่งการแจ้งเตือน |
| GET | `/arrivals` | รายการการมาถึงแบบแบ่งหน้า |
| GET | `/arrivals/:id` | ดึงการมาถึงตาม ID |
| PATCH | `/arrivals/:id` | แก้ไขการมาถึง |
| DELETE | `/arrivals/:id` | ลบการมาถึง |

### 11. Arrival Items — `/arrival-items`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/arrival-items` | รายการ arrival item |
| GET | `/arrival-items/:id` | ดึง arrival item ตาม ID |
| PATCH | `/arrival-items/:id` | แก้ไข arrival item |
| DELETE | `/arrival-items/:id` | ลบ arrival item |

### 12. Notifications — `/notifications`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/notifications` | รายการการแจ้งเตือน |
| GET | `/notifications/:id` | ดึงการแจ้งเตือนตาม ID |
| PATCH | `/notifications/:id` | อัปเดตสถานะ (เช่น อ่านแล้ว) |
| DELETE | `/notifications/:id` | ลบการแจ้งเตือน |

---

## สรุปการแบ่งส่วน

- **Super Admin**  
  - ใช้ API ที่เป็น **รายการทั้งระบบ** (GET list โดยไม่กรอง merchant), **สร้าง/แก้/ลบ user, role, permission, role-permission, merchant, customer, exchange rate** และการจัดการที่ระบุว่า ADMIN only  
  - ตัวอย่าง: `GET /dashboard/admin`, `GET /dashboard/admin/annual-report`, `GET /users`, `GET /merchants`, `POST /users/user-merchant`, `POST /roles`, `POST /permissions/generate`, `POST /role-permissions/assign`

- **Merchant / User**  
  - ใช้ API ที่ผูกกับ **Current User / Merchant** จาก JWT  
  - ตัวอย่าง: `GET /dashboard/merchant`, `GET /dashboard/merchant/annual-report`, `GET /users/by-merchant`, `GET /merchants/merchant-detail`, `PATCH /merchants/my-merchant`, `GET /customers/by-merchant`, `GET /exchange-rates/by-merchant`, `GET /exchange-rates/today`, `POST /exchange-rates`, `POST /exchange-rates/bulk`, `POST /orders/create-full`, `POST /arrivals/create`

- **Auth**  
  - `POST /auth/login` ใช้ได้ทุกคน (Public)  
  - `GET /auth/me` ใช้หลังล็อกอิน (ทั้ง Super Admin และ Merchant/User)

---

## หมายเหตุ

- ทุก API ที่ไม่ใช่ `POST /auth/login` ต้องส่ง **Bearer token** (JWT) ใน header (ยกเว้นมี `@Public()`)
- การตรวจสิทธิ์ราย route ใช้ Guard + Permission/Role ตามที่ตั้งค่าในโปรเจกต์
- ไฟล์นี้สร้างจากการตรวจสอบ controller ในโค้ดโดยตรง ไม่ได้อ้างอิงหรือแก้ไขไฟล์ `BACKEND_API_ANALYSIS.md`

---

## รายละเอียด API ใหม่: `GET /merchants/:id/detail`

### Endpoint
```
GET /merchants/:id/detail
```

### Header
| Key | Value |
|-----|-------|
| Authorization | `Bearer <access_token>` |

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Merchant ID |

### Response Format
```json
{
  "success": true,
  "Code": 200,
  "message": "Success",
  "results": [
    {
      "id": 1,
      "ownerUserId": 2,
      "shopName": "ร้านค้า ABC",
      "shopLogoUrl": null,
      "shopAddress": "123 ถ.สุขุมวิท กรุงเทพ",
      "contactPhone": "081-234-5678",
      "contactEmail": "shop@example.com",
      "contactFacebook": null,
      "contactLine": "@shop-abc",
      "contactWhatsapp": null,
      "defaultCurrency": "THB",
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-06-01T08:15:00.000Z",
      "owner": {
        "id": 2,
        "email": "owner@example.com",
        "fullName": "สมชาย ใจดี",
        "roleId": 3,
        "roleName": "admin_merchant",
        "isActive": true,
        "createdAt": "2025-01-10T09:00:00.000Z",
        "lastLogin": "2025-06-15T14:20:00.000Z"
      },
      "summary": {
        "totalCustomers": 25,
        "activeCustomers": 22,
        "inactiveCustomers": 3,
        "customerTypeCustomer": 20,
        "customerTypeAgent": 5,
        "financial": {
          "totalOrders": 48,
          "ordersUnpaid": 12,
          "ordersPartial": 8,
          "ordersPaid": 28,
          "totalIncomeLak": 85000000,
          "totalIncomeThb": 350000,
          "totalExpenseLak": 62000000,
          "totalExpenseThb": 255000,
          "totalProfitLak": 23000000,
          "totalProfitThb": 95000,
          "totalPaidAmount": 70000000,
          "totalRemainingAmount": 15000000
        }
      }
    }
  ]
}
```

### คำอธิบาย Response

| Field | Type | Description |
|-------|------|-------------|
| `id` - `updatedAt` | - | ข้อมูลร้านค้าพื้นฐาน (เหมือน GET /:id) |
| `owner` | object/null | ข้อมูลเจ้าของร้าน (owner_user_id → join users + role) |
| `summary.totalCustomers` | number | จำนวน customer ทั้งหมด |
| `summary.activeCustomers` | number | จำนวน customer ที่ active |
| `summary.inactiveCustomers` | number | จำนวน customer ที่ inactive |
| `summary.customerTypeCustomer` | number | จำนวน customer ประเภท CUSTOMER |
| `summary.customerTypeAgent` | number | จำนวน customer ประเภท AGENT |
| `summary.financial.totalOrders` | number | จำนวน orders ทั้งหมด |
| `summary.financial.ordersUnpaid` | number | จำนวน orders ที่ยังไม่จ่าย (UNPAID) |
| `summary.financial.ordersPartial` | number | จำนวน orders ที่จ่ายบางส่วน (PARTIAL) |
| `summary.financial.ordersPaid` | number | จำนวน orders ที่จ่ายครบแล้ว (PAID) |
| `summary.financial.totalIncomeLak` | number | รายรับรวม (ยอดขาย LAK) |
| `summary.financial.totalIncomeThb` | number | รายรับรวม (ยอดขาย THB) |
| `summary.financial.totalExpenseLak` | number | รายจ่ายรวม (ต้นทุน LAK) |
| `summary.financial.totalExpenseThb` | number | รายจ่ายรวม (ต้นทุน THB) |
| `summary.financial.totalProfitLak` | number | กำไรรวม LAK (รายรับ - รายจ่าย) |
| `summary.financial.totalProfitThb` | number | กำไรรวม THB |
| `summary.financial.totalPaidAmount` | number | ยอดที่จ่ายแล้วทั้งหมด |
| `summary.financial.totalRemainingAmount` | number | ยอดค้างชำระทั้งหมด |

### Error Responses

| Status | Message | Description |
|--------|---------|-------------|
| 401 | Invalid or missing token | ไม่ได้ส่ง token หรือ token หมดอายุ |
| 404 | Merchant not found | ไม่พบ merchant ที่มี id นี้ |

---

## รายละเอียด API: `GET /dashboard/merchant` — latestOrders

### Response เพิ่มเติมใน Merchant Dashboard

Response ของ `GET /dashboard/merchant` มีฟิลด์ `latestOrders` เพิ่มเข้ามา ซึ่งแสดงออเดอร์ล่าสุด 5 รายการของร้านค้า

```json
{
  "latestOrders": [
    {
      "id": 1,
      "orderCode": "ORD-20260220-001",
      "arrivalStatus": "NOT_ARRIVED",
      "totalAmount": "1500000.00",
      "customerName": "ລູກຄ້າ ທີ 1"
    },
    {
      "id": 2,
      "orderCode": "ORD-20260220-002",
      "arrivalStatus": "ARRIVED",
      "totalAmount": "2300000.00",
      "customerName": "ລູກຄ້າ ທີ 2"
    }
  ]
}
```

### คำอธิบาย latestOrders

| Field | Type | Description |
|-------|------|-------------|
| `latestOrders` | array | ออเดอร์ล่าสุด 5 รายการ เรียงตามวันสร้าง (ใหม่สุดก่อน) |
| `latestOrders[].id` | number | ID ของ order |
| `latestOrders[].orderCode` | string | รหัสออเดอร์ |
| `latestOrders[].arrivalStatus` | string | สถานะการมาถึง (`NOT_ARRIVED` / `ARRIVED`) |
| `latestOrders[].totalAmount` | string | ยอดรวมที่ลูกค้าต้องจ่าย (total_selling_amount_lak) |
| `latestOrders[].customerName` | string/null | ชื่อลูกค้า (join จาก customer_orders → customers, แสดงลูกค้าคนแรก) |

---

### Summary APIs (included in list endpoints)

#### Payment Summary (included in GET /payments/merchant response)
Response now includes a `summary` field:
```json
{
  "summary": {
    "totalPayments": 15,
    "totalAmount": "5000000.00",
    "totalPending": 5,
    "totalVerified": 8,
    "totalRejected": 2
  }
}
```

#### User/Team Member Summary (included in GET /users and GET /users/by-merchant response)
Response now includes a `summary` field:
```json
{
  "summary": {
    "totalUsers": 10,
    "totalActive": 8,
    "totalInactive": 2
  }
}
```

#### Customer Summary (included in GET /customers and GET /customers/by-merchant response)
Response now includes a `summary` field:
```json
{
  "summary": {
    "totalCustomers": 25,
    "totalActive": 20,
    "totalInactive": 5
  }
}
```
