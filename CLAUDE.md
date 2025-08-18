# PERANCANGAN WEB APP MARKETPLACE EO/WO

## 1. ARSITEKTUR SISTEM

### 1.1 Tech Stack Recommendation
- **Frontend**: React.js/Next.js dengan TypeScript
- **Backend**: Node.js dengan Express.js atau Laravel (PHP)
- **Database**: PostgreSQL/MySQL
- **Real-time Chat**: Socket.io
- **Payment Gateway**: Midtrans
- **File Storage**: AWS S3 atau CloudFront
- **API Wilayah**: API Daerah Indonesia

### 1.2 Database Schema Utama

#### Tabel Users
```sql
users (
  id, email, password, phone, 
  role (superadmin/vendor/client),
  profile_picture, is_verified,
  created_at, updated_at
)
```

#### Tabel User Profiles
```sql
user_profiles (
  id, user_id, first_name, last_name,
  province_id, regency_id, district_id, village_id,
  full_address, birth_date, gender,
  created_at, updated_at
)
```

#### Tabel Vendors
```sql
vendors (
  id, user_id, business_name, business_type,
  business_license, description, 
  coverage_radius, transport_fee_info,
  is_active, verification_status,
  created_at, updated_at
)
```

#### Tabel Vendor Categories
```sql
vendor_categories (
  id, vendor_id, category_id,
  created_at, updated_at
)
```

#### Tabel Categories
```sql
categories (
  id, name, slug, description,
  icon, is_active,
  created_at, updated_at
)
```

#### Tabel Products/Services
```sql
products (
  id, vendor_id, category_id, name, 
  description, base_price, unit_type,
  min_order, max_order, discount_percentage,
  images, specifications, terms_conditions,
  is_active, created_at, updated_at
)
```

#### Tabel Featured Products
```sql
featured_products (
  id, product_id, start_date, end_date,
  price_paid, payment_status,
  created_at, updated_at
)
```

#### Tabel Orders
```sql
orders (
  id, client_id, vendor_id, product_id,
  quantity, base_price, discount_amount,
  transport_fee, platform_fee, total_amount,
  event_date, event_location, special_requests,
  status (pending/accepted/in_progress/completed/cancelled),
  payment_status, midtrans_order_id,
  created_at, updated_at
)
```

#### Tabel Chat Rooms
```sql
chat_rooms (
  id, order_id, client_id, vendor_id,
  last_message, last_message_at,
  created_at, updated_at
)
```

#### Tabel Chat Messages
```sql
chat_messages (
  id, chat_room_id, sender_id, sender_type,
  message, message_type (text/image/file),
  attachment_url, is_read,
  created_at, updated_at
)
```

#### Tabel Reviews
```sql
reviews (
  id, order_id, client_id, vendor_id, product_id,
  rating, comment, images,
  created_at, updated_at
)
```

#### Tabel Disputes
```sql
disputes (
  id, order_id, reporter_id, reported_id,
  reason, description, evidence_images,
  status (open/investigating/resolved),
  admin_notes, resolution,
  created_at, updated_at, resolved_at
)
```

## 2. FITUR BERDASARKAN ROLE

### 2.1 SUPERADMIN

#### Dashboard Analytics:
- Total revenue & platform fee
- Statistik pengguna (vendor/klien aktif)
- Grafik transaksi harian/bulanan
- Top performing vendors/products

#### User Management:
- CRUD semua users (vendor/klien)
- Verifikasi vendor baru
- Suspend/activate accounts
- View user activity logs

#### Transaction Management:
- Monitor semua transaksi
- Kelola escrow payments
- Proses refund requests
- Featured product payments

#### Dispute Resolution:
- Handle komplain klien vs vendor
- Investigasi kasus dispute
- Keputusan refund/penalty
- Komunikasi dengan pihak terkait

#### Content Management:
- Kelola kategori vendor
- Moderate reviews/ratings
- Manage featured products
- System configurations

#### Financial Reports:
- Revenue reports
- Fee collection reports
- Payout reports ke vendor
- Tax/accounting exports

### 2.2 VENDOR

#### Dashboard Bisnis:
- Total penjualan bulan ini
- Jumlah order pending/active
- Rating rata-rata produk
- Grafik performa bulanan

#### Profile Management:
- Edit business profile
- Upload business license
- Set coverage area & transport fee
- Manage business categories

#### Product/Service Management:
- CRUD produk layanan
- Set pricing & discount
- Upload product images
- Manage product availability

#### Order Management:
- View incoming orders
- Accept/decline orders
- Update order progress
- Mark orders as completed

#### Featured Product:
- Promote products
- Payment for featured slots
- Monitor featured performance
- Renew featured periods

#### Customer Communication:
- Real-time chat dengan klien
- Order-specific conversations
- Share additional quotes/estimates
- Send updates/notifications

#### Financial Dashboard:
- Pending payments (in escrow)
- Completed payments
- Platform fee deductions
- Payout history

### 2.3 KLIEN

#### Dashboard Personal:
- Upcoming events
- Order history
- Favorite vendors
- Saved products

#### Marketplace Browsing:
- Search products by category/location
- Filter by price/rating/distance
- View vendor profiles
- Compare multiple vendors

#### Order Management:
- Create new orders
- Track order progress
- Chat dengan vendors
- Upload event requirements

#### Event Planning:
- Create event profiles
- Book multiple vendors per event
- Manage event timeline
- Coordinate dengan vendors

#### Review System:
- Rate completed services
- Write detailed reviews
- Upload service photos
- View review history

#### Payment & Refund:
- Secure payment via Midtrans
- Track payment status
- Request refunds if needed
- View transaction history

## 3. FITUR TEKNIS DETAIL

### 3.1 Sistem Pembayaran (Midtrans Integration)

#### Payment Flow:
1. Klien checkout order → generate Midtrans payment
2. Payment success → dana masuk escrow
3. Vendor complete service → klien confirm completion
4. Platform fee (10%) deducted → sisa ke vendor
5. Dispute period 1 minggu untuk refund claims

#### Escrow Logic:
- Dana tertahan sampai klien confirm completion
- Auto-release after 1 minggu jika no dispute
- Manual release by superadmin untuk dispute cases

### 3.2 Real-time Chat System

#### Socket.io Implementation:
- Room-based chat per order
- Message types: text, image, file
- Real-time notifications
- Message status: sent/delivered/read
- Chat history tersimpan permanen

### 3.3 Rating & Review System

#### Review Features:
- Rating 1-5 stars per product
- Written review dengan foto
- Anonymous option
- Vendor tidak bisa reply
- Review tampil di product page

### 3.4 Search & Filter System

#### Search Parameters:
- Location-based (province/regency/district)
- Category filtering
- Price range
- Rating minimum
- Availability dates
- Distance radius

### 3.5 Featured Product System

#### Promotion Logic:
- Flat rate untuk semua kategori
- Minimum duration 1 minggu
- Priority display di search results
- Analytics tracking untuk ROI

## 4. USER FLOW UTAMA

### 4.1 Vendor Registration Flow
1. Sign up dengan email/phone
2. Verify account via OTP
3. Complete business profile
4. Upload business documents
5. Select service categories
6. Set coverage area & fees
7. Wait for admin verification
8. Start adding products/services

### 4.2 Client Order Flow
1. Browse/search vendors
2. View product details & vendor profile
3. Initiate chat untuk diskusi requirements
4. Create order dengan custom specifications
5. Receive quote/price confirmation
6. Make payment via Midtrans
7. Track order progress
8. Chat coordination dengan vendor
9. Confirm completion & release payment
10. Leave review & rating

### 4.3 Order Management Flow

#### Vendor Side:
- Receive order notification
- Review requirements via chat
- Send custom quote if needed
- Accept order & start work
- Update progress regularly
- Mark as completed

#### Client Side:
- Monitor vendor acceptance
- Communicate requirements
- Approve/negotiate pricing
- Track service progress
- Confirm satisfactory completion

## 5. NOTIFIKASI SYSTEM

### 5.1 Email Notifications
- Registration confirmation
- Order status updates
- Payment confirmations
- Dispute notifications
- Featured product reminders

### 5.2 In-app Notifications
- New messages
- Order updates
- Payment alerts
- Review requests
- System announcements

### 5.3 Push Notifications (Mobile)
- Real-time chat messages
- Order status changes
- Payment reminders
- Event date approaching

## 6. KEAMANAN & VALIDASI

### 6.1 Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Session management
- Password encryption (bcrypt)

### 6.2 Data Validation
- Input sanitization
- File upload restrictions
- SQL injection prevention
- XSS protection

### 6.3 Business Logic Security
- Order amount validation
- Escrow payment verification
- Dispute evidence validation
- Review authenticity checks

## 7. PERFORMANCE OPTIMIZATION

### 7.1 Database Optimization
- Proper indexing untuk search queries
- Query optimization
- Database connection pooling
- Caching strategy (Redis)

### 7.2 File Management
- Image compression & optimization
- CDN untuk static files
- Lazy loading untuk images
- File size limitations

### 7.3 API Performance
- Rate limiting
- Response caching
- Pagination untuk large datasets
- Efficient search algorithms

## 8. MONITORING & ANALYTICS

### 8.1 Business Analytics
- Conversion rates
- Popular categories
- Vendor performance metrics
- Geographic distribution

### 8.2 Technical Monitoring
- Error logging
- Performance metrics
- Database query analysis
- Server resource usage

## 9. DEPLOYMENT & SCALING

### 9.1 Deployment Strategy
- Staging environment untuk testing
- Production deployment dengan CI/CD
- Database migration scripts
- Environment configuration

### 9.2 Scalability Considerations
- Horizontal scaling capability
- Load balancer setup
- Database sharding options
- Microservices architecture potential

---

**Catatan Implementasi**: Perancangan ini sudah mempertimbangkan semua requirement yang disebutkan dan real-world scenarios untuk marketplace EO/WO. Database schema dirancang untuk scalability dan performance optimal. Setiap fitur sudah detail dan siap untuk tahap development.

---

# ROADMAP PENGEMBANGAN EO/WO MARKETPLACE
## Tahapan Terstruktur & Modular

## 1. TECH STACK FINAL

### 1.1 Frontend Stack
- **Framework**: Next.js 14+ dengan TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: Zustand atau Redux Toolkit
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios dengan interceptors
- **Real-time**: Socket.io-client

### 1.2 Backend Stack
- **Framework**: Node.js dengan Express.js + TypeScript
- **Database**: MySQL dengan Prisma ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Joi atau Zod
- **File Upload**: Multer
- **Real-time**: Socket.io
- **Payment**: Midtrans Node.js SDK

### 1.3 Database & Storage
- **Database**: MySQL 8.0+
- **ORM**: Prisma (type-safe, migration support)
- **File Storage**: Local storage (./uploads) untuk MVP
- **Caching**: Node.js memory cache (upgrade ke Redis nanti)

### 1.4 External APIs
- **Wilayah Indonesia**: https://emsifa.github.io/api-wilayah-indonesia/
- **Payment Gateway**: Midtrans Sandbox → Production

### 1.5 Development Tools
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Environment**: Docker untuk development consistency

## 2. RBAC (Role-Based Access Control) STRUCTURE

### 2.1 Permissions Matrix

| Feature Module | SuperAdmin | Vendor | Client |
|---|---|---|---|
| **Authentication** | | | |
| Login/Logout | ✅ | ✅ | ✅ |
| Register | ✅ | ✅ | ✅ |
| Profile Management | ✅ | ✅ | ✅ |
| **User Management** | | | |
| View All Users | ✅ | ❌ | ❌ |
| Verify Vendors | ✅ | ❌ | ❌ |
| Suspend Users | ✅ | ❌ | ❌ |
| **Product Management** | | | |
| CRUD Products | ❌ | ✅ | ❌ |
| View Products | ✅ | ✅ | ✅ |
| Feature Products | ✅ | ✅ (own) | ❌ |
| **Order Management** | | | |
| Create Orders | ❌ | ❌ | ✅ |
| Accept Orders | ❌ | ✅ | ❌ |
| View All Orders | ✅ | ✅ (own) | ✅ (own) |
| **Payment System** | | | |
| Process Payments | ✅ | ❌ | ✅ |
| Release Escrow | ✅ | ❌ | ✅ |
| **Dispute System** | | | |
| Create Disputes | ❌ | ✅ | ✅ |
| Resolve Disputes | ✅ | ❌ | ❌ |
| **Chat System** | | | |
| Chat in Orders | ❌ | ✅ | ✅ |
| Monitor Chats | ✅ | ❌ | ❌ |

### 2.2 RBAC Implementation Structure

```typescript
// Role hierarchy
enum UserRole {
  SUPERADMIN = 'superadmin',
  VENDOR = 'vendor', 
  CLIENT = 'client'
}

// Permission groups
enum Permission {
  // User permissions
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // Product permissions  
  PRODUCT_CREATE = 'product:create',
  PRODUCT_READ = 'product:read',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',
  
  // Order permissions
  ORDER_CREATE = 'order:create',
  ORDER_READ = 'order:read',
  ORDER_UPDATE = 'order:update',
  ORDER_CANCEL = 'order:cancel',
  
  // Payment permissions
  PAYMENT_PROCESS = 'payment:process',
  PAYMENT_REFUND = 'payment:refund',
  ESCROW_RELEASE = 'escrow:release',
  
  // Admin permissions
  ADMIN_DASHBOARD = 'admin:dashboard',
  DISPUTE_RESOLVE = 'dispute:resolve',
  USER_VERIFY = 'user:verify'
}
```

## 3. TAHAPAN PENGEMBANGAN TERSTRUKTUR

### PHASE 1: FOUNDATION SETUP (Minggu 1-2)

#### 1.1 Project Initialization
- [ ] Setup Next.js project dengan TypeScript
- [ ] Setup Express.js backend dengan TypeScript
- [ ] Configure Prisma dengan MySQL
- [ ] Setup basic folder structure
- [ ] Configure ESLint, Prettier, dan environment variables

#### 1.2 Database Schema Implementation
- [ ] Create Prisma schema sesuai design
- [ ] Generate dan run initial migrations
- [ ] Seed basic data (categories, admin user)
- [ ] Test database connections

#### 1.3 Authentication Foundation
- [ ] JWT token system
- [ ] Password hashing dengan bcrypt
- [ ] Basic middleware untuk auth
- [ ] Role checking middleware

**Deliverable**: Project setup lengkap dengan auth foundation

### PHASE 2: CORE AUTHENTICATION (Minggu 3)

#### 2.1 Backend Auth APIs
- [ ] POST /api/auth/register (all roles)
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] GET /api/auth/me (get current user)
- [ ] POST /api/auth/refresh-token

#### 2.2 Frontend Auth Pages
- [ ] Login page dengan form validation
- [ ] Register page dengan role selection
- [ ] Protected route wrapper
- [ ] Auth context/state management
- [ ] Logout functionality

#### 2.3 RBAC Implementation
- [ ] Permission checking middleware
- [ ] Role-based route protection
- [ ] Frontend permission guards

**Deliverable**: Complete authentication system dengan RBAC

### PHASE 3: USER PROFILE MANAGEMENT (Minggu 4)

#### 3.1 Profile APIs
- [ ] GET /api/profile (current user profile)
- [ ] PUT /api/profile (update profile)
- [ ] POST /api/profile/avatar (upload profile picture)
- [ ] GET /api/regions/* (province, regency, district integration)

#### 3.2 Profile Frontend
- [ ] Profile view page
- [ ] Profile edit form dengan wilayah dropdown
- [ ] Avatar upload component
- [ ] Address form dengan API wilayah

#### 3.3 Vendor Specific Profile
- [ ] Business profile form
- [ ] Category selection
- [ ] Coverage area setting
- [ ] Business license upload

**Deliverable**: Complete profile management untuk semua roles

### PHASE 4: PRODUCT/SERVICE MANAGEMENT (Minggu 5-6)

#### 4.1 Product Backend APIs
- [ ] POST /api/products (vendor only)
- [ ] GET /api/products (public dengan filters)
- [ ] GET /api/products/:id (product detail)
- [ ] PUT /api/products/:id (vendor own products)
- [ ] DELETE /api/products/:id (vendor own products)
- [ ] POST /api/products/:id/images (upload product images)

#### 4.2 Product Frontend
- [ ] Product creation form (vendor)
- [ ] Product listing page (public)
- [ ] Product detail page
- [ ] Product management dashboard (vendor)
- [ ] Image upload component
- [ ] Search & filter functionality

#### 4.3 Category Management
- [ ] Category CRUD (superadmin)
- [ ] Category selection components
- [ ] Category-based filtering

**Deliverable**: Complete product management system

### PHASE 5: BASIC ORDER SYSTEM (Minggu 7-8)

#### 5.1 Order Backend APIs
- [ ] POST /api/orders (client create order)
- [ ] GET /api/orders (list orders by role)
- [ ] GET /api/orders/:id (order detail)
- [ ] PUT /api/orders/:id/accept (vendor accept)
- [ ] PUT /api/orders/:id/decline (vendor decline)
- [ ] PUT /api/orders/:id/complete (vendor mark complete)

#### 5.2 Order Frontend
- [ ] Order creation form (client)
- [ ] Order listing dashboard (vendor & client)
- [ ] Order detail view
- [ ] Order status tracking
- [ ] Basic order management actions

#### 5.3 Order Status Flow
- [ ] Status: pending → accepted → in_progress → completed
- [ ] Email notifications untuk status changes
- [ ] Order history tracking

**Deliverable**: Basic order management tanpa payment

### PHASE 6: PAYMENT INTEGRATION (Minggu 9-10)

#### 6.1 Midtrans Integration
- [ ] Midtrans configuration & SDK setup
- [ ] Payment token generation
- [ ] Payment callback handling
- [ ] Escrow logic implementation

#### 6.2 Payment APIs
- [ ] POST /api/payments/create (generate payment)
- [ ] POST /api/payments/callback (Midtrans webhook)
- [ ] POST /api/payments/release (release escrow)
- [ ] GET /api/payments/history

#### 6.3 Payment Frontend
- [ ] Payment gateway integration
- [ ] Payment status tracking
- [ ] Escrow release button (client)
- [ ] Payment history dashboard

**Deliverable**: Complete payment system dengan escrow

### PHASE 7: REAL-TIME CHAT (Minggu 11)

#### 7.1 Chat Backend
- [ ] Socket.io server setup
- [ ] Chat room management
- [ ] Message saving ke database
- [ ] File upload dalam chat

#### 7.2 Chat Frontend
- [ ] Real-time chat component
- [ ] Chat room list
- [ ] Message history
- [ ] File sharing dalam chat
- [ ] Online status indicators

**Deliverable**: Real-time chat system untuk orders

### PHASE 8: REVIEW & RATING (Minggu 12)

#### 8.1 Review APIs
- [ ] POST /api/reviews (client create review)
- [ ] GET /api/reviews/product/:id
- [ ] GET /api/reviews/vendor/:id
- [ ] POST /api/reviews/:id/images

#### 8.2 Review Frontend
- [ ] Review creation form
- [ ] Rating display components
- [ ] Review listing dengan photos
- [ ] Average rating calculations

**Deliverable**: Complete review & rating system

### PHASE 9: SUPERADMIN FEATURES (Minggu 13-14)

#### 9.1 Admin Dashboard
- [ ] Analytics dashboard
- [ ] User management interface
- [ ] Transaction monitoring
- [ ] Vendor verification system

#### 9.2 Dispute Management
- [ ] Dispute creation & handling
- [ ] Evidence upload
- [ ] Resolution workflow
- [ ] Refund processing

**Deliverable**: Complete admin functionality

### PHASE 10: ADVANCED FEATURES (Minggu 15-16)

#### 10.1 Featured Products
- [ ] Featured product payment
- [ ] Promotion duration management
- [ ] Featured display logic

#### 10.2 Advanced Search & Filters
- [ ] Location-based search
- [ ] Advanced filtering options
- [ ] Search optimization

#### 10.3 Notifications
- [ ] Email notification system
- [ ] In-app notifications
- [ ] Notification preferences

**Deliverable**: Complete marketplace dengan semua fitur

## 4. TESTING & DEPLOYMENT STRATEGY

### 4.1 Testing Approach
- **Unit Tests**: Jest untuk business logic
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright untuk critical user flows
- **Manual Testing**: User acceptance testing

### 4.2 Deployment Phases
- **Development**: Local environment
- **Staging**: Testing environment dengan sample data
- **Production**: Live deployment dengan monitoring

### 4.3 Performance Optimization
- **Database**: Query optimization & indexing
- **Caching**: Implement Redis untuk production
- **File Storage**: Upgrade ke cloud storage (AWS S3/Cloudinary)
- **CDN**: Static asset optimization

## 5. MONITORING & MAINTENANCE

### 5.1 Monitoring Setup
- **Error Tracking**: Sentry untuk error monitoring
- **Performance**: Database query monitoring
- **Analytics**: User behavior tracking

### 5.2 Backup Strategy
- **Database**: Daily automated backups
- **Files**: Regular file system backups
- **Code**: Git version control dengan branching strategy

### 5.3 Security Measures
- **Input Validation**: Comprehensive validation pada semua endpoints
- **Rate Limiting**: API rate limiting
- **Security Headers**: CORS, helmet.js implementation
- **Regular Updates**: Dependency updates & security patches

---

**Total Estimasi Waktu**: 16 minggu (4 bulan)

Setiap phase memiliki deliverable yang jelas dan dapat di-test secara independen. Approach ini memungkinkan iterative development dan early feedback dari stakeholders.