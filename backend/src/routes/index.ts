import { Router } from 'express';
import { checkDatabaseHealth } from '@/utils/db-test';
import authRoutes from './auth';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IndoVendor API is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check route
router.get('/health/database', async (req, res) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    res.json({
      success: dbHealth.status === 'healthy',
      message: `Database is ${dbHealth.status}`,
      data: dbHealth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Use route modules
router.use('/auth', authRoutes);

// TODO: Add more route imports and usage here
// import userRoutes from './users';
// import productRoutes from './products';
// import orderRoutes from './orders';
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

export default router;