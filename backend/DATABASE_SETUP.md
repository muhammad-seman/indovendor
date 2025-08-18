# Database Setup Guide - IndoVendor

This guide will help you set up the MySQL database for the IndoVendor project.

## Prerequisites

- MySQL 8.0+ installed and running
- Node.js 18+ installed
- Backend dependencies installed (`npm install`)

## Step-by-Step Setup

### 1. Create MySQL Database

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE indovendor;

-- Create user (optional, for production)
CREATE USER 'indovendor_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON indovendor.* TO 'indovendor_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 2. Configure Environment Variables

Update your `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL="mysql://root:your_password@localhost:3306/indovendor"

# Or if using dedicated user:
# DATABASE_URL="mysql://indovendor_user:your_password@localhost:3306/indovendor"
```

### 3. Run Database Setup

Execute the complete database setup:

```bash
cd backend

# Complete setup (generates client, runs migrations, seeds data)
npm run db:setup
```

Or run each step individually:

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations (creates tables)
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 4. Test Database Connection

```bash
# Test database connectivity
npm run db:test
```

### 5. Access Database (Optional)

```bash
# Open Prisma Studio to view/edit data
npm run db:studio
```

## Default Seeded Data

After running the seed script, you'll have:

### Categories (8 total)
- Wedding Organizer 💒
- Event Organizer 🎉
- Catering 🍽️
- Photography 📸
- Decoration 🌸
- Entertainment 🎵
- Venue 🏛️
- Transportation 🚗

### Users (3 total)
| Role | Email | Password | Description |
|------|-------|----------|-------------|
| SUPERADMIN | admin@indovendor.com | admin123 | System administrator |
| VENDOR | vendor@indovendor.com | vendor123 | Sample wedding organizer |
| CLIENT | client@indovendor.com | client123 | Sample customer |

### Sample Data
- 1 Vendor business profile (Elegant Weddings Jakarta)
- 2 Sample products/services
- Complete user profiles with address data

## Database Schema Overview

The database includes 12 main models:

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

## API Health Endpoints

After starting the server (`npm run dev`), test these endpoints:

- `GET http://localhost:5000/api/health` - General API health
- `GET http://localhost:5000/api/health/database` - Database connectivity

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Ensure MySQL is running: `sudo systemctl start mysql` (Linux) or `brew services start mysql` (Mac)
   - Check if port 3306 is available

2. **Authentication failed**
   - Verify username/password in DATABASE_URL
   - Check if user has proper permissions

3. **Database doesn't exist**
   - Create the database manually: `CREATE DATABASE indovendor;`

4. **Migration errors**
   - Reset database: `npm run db:reset`
   - Re-run setup: `npm run db:setup`

### Reset Database

To completely reset and rebuild the database:

```bash
# This will delete all data and recreate everything
npm run db:reset

# Then re-run setup
npm run db:setup
```

## Production Considerations

1. **Environment Variables**
   - Use strong passwords
   - Consider using connection pooling
   - Set up SSL connections

2. **Backup Strategy**
   - Set up automated backups
   - Test restore procedures

3. **Monitoring**
   - Monitor database performance
   - Set up alerts for connection issues

4. **Security**
   - Use dedicated database user with minimal permissions
   - Enable SSL/TLS for connections
   - Regular security updates

## Next Steps

After successful database setup:

1. Start the backend server: `npm run dev`
2. Test API endpoints
3. Proceed with Phase 2: Core Authentication
4. Begin frontend integration

For questions or issues, check the logs or run the database test script for detailed diagnostics.