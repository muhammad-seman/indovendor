import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - remove in production)
  console.log('🧹 Cleaning existing data...');
  await prisma.dispute.deleteMany();
  await prisma.review.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.order.deleteMany();
  await prisma.featuredProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendorCategory.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // 1. Create Categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Wedding Organizer',
        slug: 'wedding-organizer',
        description: 'Complete wedding planning and organization services',
        icon: '💒',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Event Organizer',
        slug: 'event-organizer',
        description: 'Corporate and social event planning services',
        icon: '🎉',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Catering',
        slug: 'catering',
        description: 'Food and beverage services for events',
        icon: '🍽️',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Photography',
        slug: 'photography',
        description: 'Professional photography and videography services',
        icon: '📸',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Decoration',
        slug: 'decoration',
        description: 'Event decoration and floral arrangements',
        icon: '🌸',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Entertainment',
        slug: 'entertainment',
        description: 'Music, DJ, and entertainment services',
        icon: '🎵',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Venue',
        slug: 'venue',
        description: 'Event venues and location services',
        icon: '🏛️',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Transportation',
        slug: 'transportation',
        description: 'Event transportation and logistics',
        icon: '🚗',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // 2. Create Super Admin User
  console.log('👑 Creating super admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@indovendor.com',
      password: hashedPassword,
      phone: '+628123456789',
      role: UserRole.SUPERADMIN,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          provinceId: '31',
          regencyId: '3171',
          districtId: '317101',
          villageId: '3171011001',
          fullAddress: 'Jakarta Pusat, DKI Jakarta',
          gender: 'male',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // 3. Create Sample Vendor User
  console.log('🏪 Creating sample vendor user...');
  const vendorPassword = await bcrypt.hash('vendor123', 10);
  
  const vendorUser = await prisma.user.create({
    data: {
      email: 'vendor@indovendor.com',
      password: vendorPassword,
      phone: '+628987654321',
      role: UserRole.VENDOR,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Sample',
          lastName: 'Vendor',
          provinceId: '31',
          regencyId: '3174',
          districtId: '317401',
          villageId: '3174011001',
          fullAddress: 'Jakarta Selatan, DKI Jakarta',
          gender: 'female',
        },
      },
      vendor: {
        create: {
          businessName: 'Elegant Weddings Jakarta',
          businessType: 'Wedding Organizer',
          description: 'Professional wedding planning services with 10+ years experience',
          coverageRadius: 50,
          transportFeeInfo: 'Free within Jakarta, Rp 500,000 outside Jakarta',
          isActive: true,
          verificationStatus: 'VERIFIED',
          categories: {
            create: [
              { categoryId: categories[0].id }, // Wedding Organizer
              { categoryId: categories[4].id }, // Decoration
            ],
          },
        },
      },
    },
    include: {
      profile: true,
      vendor: {
        include: {
          categories: true,
        },
      },
    },
  });

  console.log(`✅ Created vendor user: ${vendorUser.email}`);

  // 4. Create Sample Client User
  console.log('👤 Creating sample client user...');
  const clientPassword = await bcrypt.hash('client123', 10);
  
  const clientUser = await prisma.user.create({
    data: {
      email: 'client@indovendor.com',
      password: clientPassword,
      phone: '+628111222333',
      role: UserRole.CLIENT,
      isVerified: true,
      profile: {
        create: {
          firstName: 'Sample',
          lastName: 'Client',
          provinceId: '31',
          regencyId: '3175',
          districtId: '317501',
          villageId: '3175011001',
          fullAddress: 'Jakarta Timur, DKI Jakarta',
          birthDate: new Date('1990-01-01'),
          gender: 'male',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Created client user: ${clientUser.email}`);

  // 5. Create Sample Products for Vendor
  console.log('📦 Creating sample products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        vendorId: vendorUser.vendor!.id,
        categoryId: categories[0].id, // Wedding Organizer
        name: 'Complete Wedding Package - Premium',
        description: 'All-inclusive wedding package including planning, coordination, decoration, and vendor management',
        basePrice: 50000000, // Rp 50,000,000
        unitType: 'package',
        minOrder: 1,
        maxOrder: 1,
        discountPercentage: 10,
        images: JSON.stringify([
          'wedding-package-1.jpg',
          'wedding-package-2.jpg',
          'wedding-package-3.jpg',
        ]),
        specifications: 'Includes: Full wedding planning, venue decoration, bridal makeup, photography (8 hours), videography, sound system, lighting, wedding cake, 300 guest capacity',
        termsConditions: 'Payment in 3 installments: 50% booking, 30% 1 month before, 20% on event day. Cancellation fee applies.',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        vendorId: vendorUser.vendor!.id,
        categoryId: categories[4].id, // Decoration
        name: 'Elegant Wedding Decoration',
        description: 'Beautiful floral arrangements and venue decoration for your special day',
        basePrice: 15000000, // Rp 15,000,000
        unitType: 'package',
        minOrder: 1,
        maxOrder: 3,
        discountPercentage: 5,
        images: JSON.stringify([
          'decoration-1.jpg',
          'decoration-2.jpg',
        ]),
        specifications: 'Fresh flowers, backdrop, aisle decoration, centerpieces, lighting setup',
        termsConditions: 'Setup 1 day before event. Additional charges for venue outside Jakarta.',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} sample products`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Created data summary:');
  console.log(`   • ${categories.length} categories`);
  console.log(`   • 3 users (1 admin, 1 vendor, 1 client)`);
  console.log(`   • 1 vendor profile with business details`);
  console.log(`   • ${products.length} sample products`);
  console.log('\n🔐 Default login credentials:');
  console.log('   👑 Admin: admin@indovendor.com / admin123');
  console.log('   🏪 Vendor: vendor@indovendor.com / vendor123');
  console.log('   👤 Client: client@indovendor.com / client123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });