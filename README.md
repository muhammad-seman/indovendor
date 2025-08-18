# IndoVendor - EO/WO Marketplace

A comprehensive marketplace platform for Event Organizers (EO) and Wedding Organizers (WO) in Indonesia.

## Monorepo Structure

```
indovendor/
├── backend/           # Express.js backend API
│   ├── src/           # Backend source code
│   ├── prisma/        # Database schema & migrations
│   └── package.json   # Backend dependencies
├── frontend/          # Next.js frontend application
│   ├── src/           # Frontend source code
│   └── package.json   # Frontend dependencies
├── CLAUDE.md          # Project documentation and roadmap
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Context / Zustand
- **HTTP Client**: Axios

### Backend
- **Framework**: Node.js with Express.js + TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Payment**: Midtrans Integration

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL (v8.0+)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Environment Setup

1. Copy environment files:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env.local
   ```

2. Update the environment variables with your database credentials and API keys.

### Database Setup

1. **Create MySQL Database:**
   ```sql
   mysql -u root -p
   CREATE DATABASE indovendor;
   EXIT;
   ```

2. **Configure Environment:**
   Update `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL="mysql://root:your_password@localhost:3306/indovendor"
   ```

3. **Run Complete Database Setup:**
   ```bash
   cd backend
   npm run db:setup
   ```
   This will:
   - Generate Prisma client
   - Run database migrations (create tables)
   - Seed initial data (categories, admin user, sample data)

4. **Test Database Connection:**
   ```bash
   npm run db:test
   ```

**📋 Default Login Credentials:**
- 👑 Admin: `admin@indovendor.com` / `admin123`
- 🏪 Vendor: `vendor@indovendor.com` / `vendor123`  
- 👤 Client: `client@indovendor.com` / `client123`

See `backend/DATABASE_SETUP.md` for detailed setup instructions.

### Running the Applications (Monorepo)

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

**Note**: This is a monorepo - both frontend and backend are in the same Git repository but run as separate applications.

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`.

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:setup` - Complete database setup
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:test` - Test database connection
- `npm run db:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Monorepo (from root)
- `npm run dev:backend` - Start backend development server
- `npm run dev:frontend` - Start frontend development server
- `npm run build:backend` - Build backend for production
- `npm run build:frontend` - Build frontend for production
- `npm run install:all` - Install all dependencies
- `npm run lint:all` - Run linting for both projects

## Project Features

- **Multi-role System**: SuperAdmin, Vendor, Client
- **Product Management**: CRUD operations for services/products
- **Order System**: Complete order workflow with escrow payments
- **Real-time Chat**: Socket.io integration
- **Payment Integration**: Midtrans payment gateway
- **File Upload**: Image and document management
- **Review & Rating**: Customer feedback system
- **Dispute Management**: Admin-mediated dispute resolution
- **Location-based Search**: Indonesian regional API integration

## API Endpoints

After starting the backend, test these endpoints:

- `GET http://localhost:5000/api/health` - API health check
- `GET http://localhost:5000/api/health/database` - Database connectivity check

## Development Roadmap

See `CLAUDE.md` for detailed development phases and implementation guide.

## Database Schema

The application uses 12 main database models:

1. **User** - System users (admin/vendor/client)
2. **UserProfile** - User personal information  
3. **Vendor** - Business vendor information
4. **Category** - Service categories
5. **VendorCategory** - Vendor-category relationships
6. **Product** - Services/products offered by vendors
7. **FeaturedProduct** - Promoted products
8. **Order** - Customer orders
9. **ChatRoom** - Order-specific chat rooms
10. **ChatMessage** - Chat messages
11. **Review** - Customer reviews
12. **Dispute** - Order disputes

## Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## Troubleshooting

### Common Issues

1. **Database connection errors**: Verify MySQL is running and credentials are correct
2. **Port conflicts**: Ensure ports 3000 and 5000 are available
3. **Environment variables**: Check all required variables are set
4. **Dependencies**: Run `npm install` in both backend and frontend directories

For detailed troubleshooting, see `backend/DATABASE_SETUP.md`.

## License

This project is proprietary and confidential.

## Support

For questions or issues:
1. Check the troubleshooting section
2. Review the development roadmap in `CLAUDE.md`
3. Run database tests: `cd backend && npm run db:test`
4. Check API health: `curl http://localhost:5000/api/health`