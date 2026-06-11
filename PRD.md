# Product Requirements Document (PRD)

# Rosier Product Sample Request Portal

Version: 1.0  
Prepared For: Portfolio / UI-UX Case Study / Front-End Portfolio  
Platform: Next.js Web Application  
Industry: Agriculture / Fertilizer / B2B Distribution

---

# 1. Executive Summary

Rosier Product Sample Request Portal adalah platform B2B yang memungkinkan distributor resmi Rosier untuk mengajukan permintaan sampel produk pupuk sebelum melakukan pembelian dalam jumlah besar.

Saat ini proses permintaan sampel masih dilakukan melalui email atau komunikasi manual dengan sales representative sehingga menyebabkan:

- Proses pengajuan lambat
- Sulit melacak status permintaan
- Tidak adanya histori permintaan yang terpusat
- Tingginya beban administratif pada tim sales

Portal ini bertujuan mendigitalisasi proses permintaan sampel sehingga distributor dapat mengajukan, melacak, dan mengelola permintaan sampel secara mandiri.

---

# 2. Background

Rosier memiliki berbagai jenis produk pupuk untuk kebutuhan pertanian yang berbeda.

Sebelum melakukan pembelian dalam jumlah besar, distributor biasanya ingin mencoba produk tertentu terlebih dahulu melalui sample request.

Saat ini proses tersebut dilakukan secara manual:

```text
Distributor
    ↓
Email Sales
    ↓
Review Manual
    ↓
Warehouse
    ↓
Shipment
    ↓
Follow Up
```

Proses ini tidak memiliki tracking yang jelas dan sulit dimonitor oleh seluruh pihak yang terlibat.

---

# 3. Problem Statement

Distributor mengalami kesulitan:

1. Mengajukan permintaan sampel secara cepat
2. Mengetahui status permintaan
3. Melihat riwayat sample request

Tim internal Rosier mengalami kesulitan:

1. Mengelola banyak permintaan dari berbagai channel
2. Melacak status permintaan
3. Menentukan prioritas permintaan
4. Menyimpan histori aktivitas

---

# 4. Proposed Solution

Membangun platform web berbasis Next.js yang memungkinkan:

### Distributor

- Login
- Browse Products
- Request Sample
- Track Status
- View History

### Admin

- Review Request
- Approve Request
- Reject Request
- Update Status
- Monitor Activity

---

# 5. Project Type

## Portfolio Project

Project ini dibuat sebagai:

- UI/UX Case Study
- Product Design Case Study
- Front-End Development Portfolio
- Business Analysis Portfolio

Project menggunakan mock data dan tidak terhubung ke database produksi.

---

# 6. Technical Scope

## Current Version

### Frontend

- Next.js 15
- TypeScript
- TailwindCSS
- Shadcn UI

### Data

- Mock JSON
- Local State
- Local Storage

### Authentication

- Simulated Login
- Demo Accounts

### Deployment

- Vercel

---

## Future Production Version

- PostgreSQL
- Prisma ORM
- NextAuth
- Role-Based Access Control
- Email Service
- ERP Integration

---

# 7. Business Goals

- Mengurangi proses manual
- Mempermudah distributor
- Meningkatkan transparansi
- Meningkatkan efisiensi operasional

---

# 8. User Goals

Distributor ingin:

- Mengajukan sample request dengan cepat
- Mengetahui status request
- Mengelola histori request

Admin ingin:

- Mengelola request secara terpusat
- Melihat request baru
- Mengupdate status

---

# 9. Success Criteria

| Criteria | Target |
|-----------|-----------|
| User dapat membuat request | 100% |
| User dapat melacak status | 100% |
| Responsive Layout | Desktop & Tablet |
| Consistent Design System | Applied |
| Portfolio Ready | Yes |

---

# 10. User Roles

## Distributor

Permissions:

- Login
- View Products
- Create Sample Request
- View Request History
- View Notifications
- Manage Profile

---

## Admin

Permissions:

- Login
- View Requests
- Approve Requests
- Reject Requests
- Update Status
- Manage Products

---

# 11. User Personas

## Distributor Manager

Name: Michael Johnson

Age: 38

Goals:

- Mencoba produk baru
- Melacak permintaan sampel

Pain Points:

- Tidak ada tracking
- Komunikasi melalui email lambat

---

## Sales Admin

Name: Emma Wilson

Age: 29

Goals:

- Mengelola permintaan secara terpusat

Pain Points:

- Banyak email masuk
- Sulit tracking

---

# 12. User Journey

## Distributor

```text
Login
 ↓
Dashboard
 ↓
Browse Products
 ↓
Request Sample
 ↓
Submit Request
 ↓
Waiting Review
 ↓
Approved
 ↓
Completed
```

---

## Admin

```text
Login
 ↓
Dashboard
 ↓
Review Requests
 ↓
Approve / Reject
 ↓
Update Status
```

---

# 13. Information Architecture

## Public

- Login
- Forgot Password

---

## Distributor

- Dashboard
- Product Catalog
- Product Detail
- Request Sample
- Request History
- Notifications
- Profile

---

## Admin

- Dashboard
- Request Management
- Product Management
- User Management

---

# 14. Functional Requirements

## FR-01 Login

### Description

User dapat login menggunakan akun demo.

### Acceptance Criteria

- Email valid
- Password valid
- Redirect ke dashboard

---

## FR-02 Product Catalog

### Description

Menampilkan seluruh produk Rosier.

### Features

- Search
- Filter Category
- Product Card
- Pagination

---

## FR-03 Product Detail

### Information

- Product Name
- Description
- Category
- Packaging
- Product Image

---

## FR-04 Create Sample Request

### Description

Distributor dapat meminta sampel produk.

### Fields

- Product
- Quantity
- Delivery Address
- Purpose
- Notes

### Validation

- Product Required
- Quantity > 0

---

## FR-05 Request History

### Description

Menampilkan seluruh histori request.

### Features

- Search
- Filter Status
- Sort Date

---

## FR-06 Request Tracking

### Status

- Draft
- Submitted
- Pending Review
- Approved
- Rejected
- Processing
- Shipped
- Completed

---

## FR-07 Notifications

### Trigger

- Request Submitted
- Request Approved
- Request Rejected
- Request Shipped

---

## FR-08 Profile Management

### Fields

- Company Name
- Contact Person
- Email
- Phone Number
- Address

---

## FR-09 Admin Request Management

### Actions

- View Request
- Approve
- Reject
- Update Status

---

## FR-10 Product Management

### Actions

- Create Product
- Edit Product
- Delete Product

---

# 15. Non Functional Requirements

## Performance

- Initial Load < 3 Seconds
- Navigation < 1 Second

---

## Security

- Simulated Authentication
- Protected Routes
- Session Persistence via Local Storage

---

## Accessibility

- WCAG AA
- Keyboard Navigation
- Contrast Ratio 4.5:1

---

# 16. Data Model

## User

```ts
type User = {
  id: string
  name: string
  email: string
  role: "admin" | "distributor"
}
```

---

## Product

```ts
type Product = {
  id: string
  name: string
  category: string
  description: string
  packaging: string
  image: string
}
```

---

## SampleRequest

```ts
type SampleRequest = {
  id: string
  userId: string
  productId: string
  quantity: number
  address: string
  purpose: string
  notes: string
  status: string
  createdAt: string
}
```

---

## Notification

```ts
type Notification = {
  id: string
  userId: string
  title: string
  isRead: boolean
}
```

---

# 17. Design System

## Brand Colors

### Rosier Blue

```css
#0066B3
```

Primary Brand Color

---

### Rosier Light Blue

```css
#00AEEF
```

Secondary Color

---

### Rosier Green

```css
#8DC63F
```

Success State

---

### Neutral

```css
#F5F7FA
#D9E2EC
#52606D
#102A43
```

---

## Typography

### Font

Inter

---

## Border Radius

```css
12px
```

---

## Spacing System

```css
4
8
12
16
24
32
48
64
```

---

# 18. Demo Accounts

## Distributor

Email:

```text
distributor@rosier.demo
```

Password:

```text
password123
```

---

## Admin

Email:

```text
admin@rosier.demo
```

Password:

```text
password123
```

---

# 19. MVP Features

Included:

- Login
- Dashboard
- Product Catalog
- Product Detail
- Sample Request
- Request History
- Request Tracking
- Notifications
- Profile
- Admin Dashboard
- Request Management

Excluded:

- Real Database
- Email Service
- Shipment Tracking API
- ERP Integration
- Mobile Application

---

# 20. UI Screens

## Public

1. Login
2. Forgot Password

---

## Distributor

3. Dashboard
4. Product Catalog
5. Product Detail
6. Request Sample Form
7. Request History
8. Request Detail
9. Notifications
10. Profile

---

## Admin

11. Admin Dashboard
12. Request Management
13. Request Detail
14. Product Management
15. User Management

---

Total Screens: 15

---

# 21. Future Enhancements

Phase 2

- Email Notifications
- Analytics Dashboard
- Export PDF
- Inventory Visibility

---

Phase 3

- PostgreSQL
- ERP Integration
- Shipment Tracking
- Mobile App

---

# 22. Next.js Folder Structure

```text
src/
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── products/
│   ├── requests/
│   ├── notifications/
│   ├── profile/
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── products/
│   └── requests/
│
├── data/
│   ├── products.ts
│   ├── requests.ts
│   ├── users.ts
│
├── types/
│
├── hooks/
│
├── lib/
│
└── constants/
```

---

# 23. Conclusion

Rosier Product Sample Request Portal adalah platform B2B yang membantu distributor mengajukan permintaan sampel produk secara digital sebelum melakukan pembelian dalam jumlah besar.

Project ini dirancang sebagai portfolio project yang menampilkan kemampuan dalam Business Analysis, UI/UX Design, Front-End Development menggunakan Next.js, serta simulasi workflow bisnis yang realistis di industri pupuk.