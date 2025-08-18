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

1. Create a MySQL database named `indovendor`
2. Update `DATABASE_URL` in backend/.env
3. Run Prisma migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

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

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Features

- **Multi-role System**: SuperAdmin, Vendor, Client
- **Product Management**: CRUD operations for services/products
- **Order System**: Complete order workflow with escrow payments
- **Real-time Chat**: Socket.io integration
- **Payment Integration**: Midtrans payment gateway
- **File Upload**: Image and document management
- **Review & Rating**: Customer feedback system
- **Dispute Management**: Admin-mediated dispute resolution

## Development Roadmap

See `CLAUDE.md` for detailed development phases and implementation guide.

## Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is proprietary and confidential.