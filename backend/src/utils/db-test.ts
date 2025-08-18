import prisma from '@/config/database';

/**
 * Test database connection and basic operations
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔗 Testing database connection...');

    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test database queries
    console.log('🔍 Testing database queries...');

    // Test count operations
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const vendorCount = await prisma.vendor.count();

    console.log(`📊 Database statistics:`);
    console.log(`   • Users: ${userCount}`);
    console.log(`   • Categories: ${categoryCount}`);
    console.log(`   • Vendors: ${vendorCount}`);

    // Test complex query with relations
    console.log('🔍 Testing complex query...');
    const adminUser = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' },
      include: { profile: true },
    });

    if (adminUser) {
      console.log(`✅ Found admin user: ${adminUser.email}`);
      console.log(`   • Name: ${adminUser.profile?.firstName} ${adminUser.profile?.lastName}`);
      console.log(`   • Verified: ${adminUser.isVerified}`);
    }

    // Test vendor query with nested relations
    const vendors = await prisma.vendor.findMany({
      include: {
        user: {
          include: { profile: true },
        },
        categories: {
          include: { category: true },
        },
        products: true,
      },
      take: 3,
    });

    console.log(`✅ Found ${vendors.length} vendors with full details`);
    vendors.forEach((vendor, index) => {
      console.log(`   ${index + 1}. ${vendor.businessName} (${vendor.user.email})`);
      console.log(`      • Categories: ${vendor.categories.length}`);
      console.log(`      • Products: ${vendor.products.length}`);
      console.log(`      • Status: ${vendor.verificationStatus}`);
    });

    console.log('✅ All database tests passed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Test database health for API endpoints
 */
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

// Run test if called directly
if (require.main === module) {
  testDatabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}