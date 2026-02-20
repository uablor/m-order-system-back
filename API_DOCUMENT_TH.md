# เอกสารสรุป API Backend (m-order-system-back)

เอกสารนี้อธิบายจำนวน API ทั้งหมด การทำงานโดยย่อ และการแบ่งส่วนสำหรับ **Super Admin** กับ **Merchant/User** (ไม่แก้ไขหรือลบไฟล์ BACKEND_API_ANALYSIS.md)

---

## สรุปจำนวน API ทั้งหมด

| กลุ่ม (Module) | จำนวน Endpoint | หมายเหตุ |
|----------------|----------------|----------|
| Auth | 2 | ล็อกอิน + ดึงโปรไฟล์ |
| Users | 11 | จัดการผู้ใช้ + สร้าง user-merchant |
| Roles | 5 | จัดการบทบาท (ใช้กับ Super Admin) |
| Permissions | 6 | จัดการสิทธิ์ (รวม generate) |
| Role-Permissions | 3 | ผูกสิทธิ์กับบทบาท |
| Merchants | 7 | จัดการร้านค้า |
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
| **รวม** | **77** | |

---

## ส่วนที่ใช้กับ Super Admin (ผู้ดูแลระบบสูงสุด)

Super Admin ใช้ API เหล่านี้เพื่อจัดการทั้งระบบ ไม่ผูกกับร้านใดร้านหนึ่ง

### 1. Auth — `/auth`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/auth/login` | ล็อกอินด้วยอีเมล/รหัสผ่าน (Public) |
| GET | `/auth/me` | ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่ (Bearer token) |

### 2. Users — `/users`
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

### 3. Roles — `/roles`
ใช้กับ Super Admin เท่านั้น (มี `@UseGuards(RolesGuard)` และ `@Roles(ADMIN_ROLE)` บาง route)

| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/roles` | สร้างบทบาท (ADMIN only) |
| GET | `/roles` | รายการบทบาทแบบแบ่งหน้า |
| GET | `/roles/:id` | ดึงบทบาทตาม ID |
| PATCH | `/roles/:id` | แก้ไขบทบาท |
| DELETE | `/roles/:id` | ลบบทบาท |

### 4. Permissions — `/permissions`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/permissions/generate` | สร้าง permission จากชื่อ controller/method (ADMIN only) |
| POST | `/permissions` | สร้างสิทธิ์ใหม่ |
| GET | `/permissions` | รายการสิทธิ์แบบแบ่งหน้า |
| GET | `/permissions/:id` | ดึงสิทธิ์ตาม ID |
| PATCH | `/permissions/:id` | แก้ไขสิทธิ์ |
| DELETE | `/permissions/:id` | ลบสิทธิ์ |

### 5. Role-Permissions — `/role-permissions`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/role-permissions/assign` | ผูกสิทธิ์ให้บทบาท (ADMIN only) |
| DELETE | `/role-permissions/:roleId/:permissionId` | ยกเลิกการผูกสิทธิ์จากบทบาท |
| GET | `/role-permissions/role/:roleId` | รายการสิทธิ์ของบทบาทตาม roleId |

### 6. Merchants (ส่วนที่ Super Admin ใช้) — `/merchants`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/merchants` | รายการร้านค้าทั้งหมดแบบแบ่งหน้า |
| GET | `/merchants/:id` | ดึงร้านค้าตาม ID |
| PATCH | `/merchants/:id` | แก้ไขร้านค้าตาม ID |
| DELETE | `/merchants/:id` | ลบร้านค้า |

### 7. Customers (ส่วนที่ Super Admin ใช้) — `/customers`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/customers` | รายการลูกค้าทั้งหมด (เลือก filter ตาม merchantId ได้) |
| GET | `/customers/:id` | ดึงลูกค้าตาม ID |
| PATCH | `/customers/:id` | แก้ไขลูกค้า |
| DELETE | `/customers/:id` | ลบลูกค้า |

### 8. Exchange Rates (ส่วนที่ Super Admin ใช้) — `/exchange-rates`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/exchange-rates` | รายการอัตราแลกเปลี่ยนแบบแบ่งหน้า (ทุก merchant) |
| GET | `/exchange-rates/:id` | ดึงอัตราแลกเปลี่ยนตาม ID |
| PATCH | `/exchange-rates/:id` | แก้ไขอัตราแลกเปลี่ยน |
| DELETE | `/exchange-rates/:id` | ลบอัตราแลกเปลี่ยน |

### 9. Orders, Order Items, Customer Orders, Customer Order Items
Super Admin สามารถเรียก GET list / GET by id / PATCH / DELETE ได้ตามสิทธิ์ที่กำหนดไว้ในระบบ (ใช้ร่วมกับ permission/role)

### 10. Arrivals, Arrival Items, Notifications
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

### 2. Merchants (ส่วนของ Merchant) — `/merchants`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/merchants` | สร้างร้านค้า (ผูกกับ current user) |
| GET | `/merchants/merchant-detail` | ดึงรายละเอียดร้านของตัวเอง (ตาม userId จาก token) |
| PATCH | `/merchants/my-merchant` | แก้ไขร้านของตัวเอง |

### 3. Customers (ส่วนของ Merchant) — `/customers`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/customers` | สร้างลูกค้า (มักผูกกับ merchant จาก token) |
| GET | `/customers/by-merchant` | รายการลูกค้าของร้าน (ตาม merchant จาก token) |

### 4. Exchange Rates (ส่วนของ Merchant) — `/exchange-rates`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/exchange-rates` | สร้างอัตราแลกเปลี่ยนของร้าน |
| POST | `/exchange-rates/bulk` | สร้างอัตราแลกเปลี่ยนหลายรายการ (เช่น BUY + SELL) |
| GET | `/exchange-rates/by-merchant` | รายการอัตราแลกเปลี่ยนของร้าน |
| GET | `/exchange-rates/today` | อัตราวันนี้ (BUY/SELL) ของร้าน จาก token |
| PATCH | `/exchange-rates/:id/by-merchant` | แก้ไขอัตราของร้าน (ตรวจสิทธิ์ตาม merchant) |

### 5. Orders (ส่วนของ Merchant) — `/orders`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/orders/create-full` | สร้างออเดอร์เต็ม (ออเดอร์ + รายการ + customer orders) ในครั้งเดียว |
| POST | `/orders` | สร้างออเดอร์ (ส่วนหัวเท่านั้น) |
| GET | `/orders` | รายการออเดอร์ (มักกรองตาม merchant ใน service) |
| GET | `/orders/:id` | ดึงออเดอร์ตาม ID |
| PATCH | `/orders/:id` | แก้ไขออเดอร์ |
| DELETE | `/orders/:id` | ลบออเดอร์ |

### 6. Order Items — `/order-items`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/order-items` | รายการ order item (filter ตาม orderId ได้) |
| GET | `/order-items/:id` | ดึง order item ตาม ID |

### 7. Customer Orders — `/customer-orders`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/customer-orders` | รายการ customer order (filter ตาม orderId, customerId ได้) |
| GET | `/customer-orders/:id` | ดึง customer order ตาม ID |

### 8. Customer Order Items — `/customer-order-items`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/customer-order-items` | รายการ customer order item |
| GET | `/customer-order-items/:id` | ดึง customer order item ตาม ID |

### 9. Arrivals (ส่วนของ Merchant) — `/arrivals`
| Method | Path | การทำงาน |
|--------|------|-----------|
| POST | `/arrivals/create` | บันทึกการมาถึง สร้าง arrival items อัปเดตสต็อก และส่งการแจ้งเตือน |
| GET | `/arrivals` | รายการการมาถึงแบบแบ่งหน้า |
| GET | `/arrivals/:id` | ดึงการมาถึงตาม ID |
| PATCH | `/arrivals/:id` | แก้ไขการมาถึง |
| DELETE | `/arrivals/:id` | ลบการมาถึง |

### 10. Arrival Items — `/arrival-items`
| Method | Path | การทำงาน |
|--------|------|-----------|
| GET | `/arrival-items` | รายการ arrival item |
| GET | `/arrival-items/:id` | ดึง arrival item ตาม ID |
| PATCH | `/arrival-items/:id` | แก้ไข arrival item |
| DELETE | `/arrival-items/:id` | ลบ arrival item |

### 11. Notifications — `/notifications`
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
  - ตัวอย่าง: `GET /users`, `GET /merchants`, `POST /users/user-merchant`, `POST /roles`, `POST /permissions/generate`, `POST /role-permissions/assign`

- **Merchant / User**  
  - ใช้ API ที่ผูกกับ **Current User / Merchant** จาก JWT  
  - ตัวอย่าง: `GET /users/by-merchant`, `GET /merchants/merchant-detail`, `PATCH /merchants/my-merchant`, `GET /customers/by-merchant`, `GET /exchange-rates/by-merchant`, `GET /exchange-rates/today`, `POST /exchange-rates`, `POST /exchange-rates/bulk`, `POST /orders/create-full`, `POST /arrivals/create`

- **Auth**  
  - `POST /auth/login` ใช้ได้ทุกคน (Public)  
  - `GET /auth/me` ใช้หลังล็อกอิน (ทั้ง Super Admin และ Merchant/User)

---

## หมายเหตุ

- ทุก API ที่ไม่ใช่ `POST /auth/login` ต้องส่ง **Bearer token** (JWT) ใน header (ยกเว้นมี `@Public()`)
- การตรวจสิทธิ์ราย route ใช้ Guard + Permission/Role ตามที่ตั้งค่าในโปรเจกต์
- ไฟล์นี้สร้างจากการตรวจสอบ controller ในโค้ดโดยตรง ไม่ได้อ้างอิงหรือแก้ไขไฟล์ `BACKEND_API_ANALYSIS.md`
