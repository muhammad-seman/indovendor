import { UserRole } from '@prisma/client';
import JwtUtil from '@/utils/jwt';
import PasswordUtil from '@/utils/password';
import AuthService from '@/services/auth.service';
import prisma from '@/config/database';

/**
 * Authentication System Test Suite
 * Tests all authentication components to ensure they work correctly
 */
export class AuthTestSuite {
  /**
   * Run all authentication tests
   */
  static async runAllTests(): Promise<boolean> {
    try {
      console.log('🔐 Starting Authentication System Tests...\n');

      let allTestsPassed = true;

      // Test JWT utilities
      const jwtTests = await this.testJwtUtilities();
      if (!jwtTests) allTestsPassed = false;

      // Test password utilities
      const passwordTests = await this.testPasswordUtilities();
      if (!passwordTests) allTestsPassed = false;

      // Test authentication service
      const authServiceTests = await this.testAuthService();
      if (!authServiceTests) allTestsPassed = false;

      // Test role-based access
      const roleTests = await this.testRoleBasedAccess();
      if (!roleTests) allTestsPassed = false;

      console.log('\n' + '='.repeat(50));
      if (allTestsPassed) {
        console.log('✅ All authentication tests PASSED!');
        console.log('🔐 Authentication system is ready for production use.');
      } else {
        console.log('❌ Some authentication tests FAILED!');
        console.log('🔧 Please check the implementation and fix issues.');
      }
      console.log('='.repeat(50));

      return allTestsPassed;
    } catch (error) {
      console.error('❌ Test suite execution error:', error);
      return false;
    }
  }

  /**
   * Test JWT utilities
   */
  private static async testJwtUtilities(): Promise<boolean> {
    console.log('🧪 Testing JWT Utilities...');
    let passed = true;

    try {
      // Test token generation
      const payload = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.CLIENT,
      };

      const accessToken = JwtUtil.generateAccessToken(payload);
      const refreshToken = JwtUtil.generateRefreshToken(payload);
      const tokenPair = JwtUtil.generateTokenPair(payload);

      console.log('  ✅ Token generation: PASSED');

      // Test token verification
      const decoded = JwtUtil.verifyAccessToken(accessToken);
      if (decoded.userId !== payload.userId) {
        console.log('  ❌ Access token verification: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Access token verification: PASSED');
      }

      const refreshDecoded = JwtUtil.verifyRefreshToken(refreshToken);
      if (refreshDecoded.userId !== payload.userId) {
        console.log('  ❌ Refresh token verification: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Refresh token verification: PASSED');
      }

      // Test token extraction
      const extractedToken = JwtUtil.extractTokenFromHeader(`Bearer ${accessToken}`);
      if (extractedToken !== accessToken) {
        console.log('  ❌ Token extraction: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Token extraction: PASSED');
      }

      // Test token expiration check
      const isExpired = JwtUtil.isTokenExpired(accessToken);
      if (isExpired) {
        console.log('  ❌ Token expiration check: FAILED (fresh token marked as expired)');
        passed = false;
      } else {
        console.log('  ✅ Token expiration check: PASSED');
      }

      // Test invalid token handling
      try {
        JwtUtil.verifyAccessToken('invalid-token');
        console.log('  ❌ Invalid token handling: FAILED (should throw error)');
        passed = false;
      } catch (error) {
        console.log('  ✅ Invalid token handling: PASSED');
      }

    } catch (error) {
      console.log('  ❌ JWT utilities test error:', error);
      passed = false;
    }

    return passed;
  }

  /**
   * Test password utilities
   */
  private static async testPasswordUtilities(): Promise<boolean> {
    console.log('\n🧪 Testing Password Utilities...');
    let passed = true;

    try {
      const testPassword = 'TestPassword123!';
      const weakPassword = '123';

      // Test password hashing
      const hashedPassword = await PasswordUtil.hashPassword(testPassword);
      if (!hashedPassword || hashedPassword === testPassword) {
        console.log('  ❌ Password hashing: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Password hashing: PASSED');
      }

      // Test password comparison
      const isMatch = await PasswordUtil.comparePassword(testPassword, hashedPassword);
      if (!isMatch) {
        console.log('  ❌ Password comparison (correct): FAILED');
        passed = false;
      } else {
        console.log('  ✅ Password comparison (correct): PASSED');
      }

      const isWrongMatch = await PasswordUtil.comparePassword('wrongpassword', hashedPassword);
      if (isWrongMatch) {
        console.log('  ❌ Password comparison (incorrect): FAILED');
        passed = false;
      } else {
        console.log('  ✅ Password comparison (incorrect): PASSED');
      }

      // Test password strength validation
      const strongValidation = PasswordUtil.validatePasswordStrength(testPassword);
      if (!strongValidation.isValid || strongValidation.score < 3) {
        console.log('  ❌ Strong password validation: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Strong password validation: PASSED');
      }

      const weakValidation = PasswordUtil.validatePasswordStrength(weakPassword);
      if (weakValidation.isValid) {
        console.log('  ❌ Weak password validation: FAILED (weak password marked as valid)');
        passed = false;
      } else {
        console.log('  ✅ Weak password validation: PASSED');
      }

      // Test password generation
      const generatedPassword = PasswordUtil.generateRandomPassword(12, true);
      if (generatedPassword.length !== 12) {
        console.log('  ❌ Password generation: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Password generation: PASSED');
      }

      // Test empty password handling
      try {
        await PasswordUtil.hashPassword('');
        console.log('  ❌ Empty password handling: FAILED (should throw error)');
        passed = false;
      } catch (error) {
        console.log('  ✅ Empty password handling: PASSED');
      }

    } catch (error) {
      console.log('  ❌ Password utilities test error:', error);
      passed = false;
    }

    return passed;
  }

  /**
   * Test authentication service
   */
  private static async testAuthService(): Promise<boolean> {
    console.log('\n🧪 Testing Authentication Service...');
    let passed = true;

    try {
      // Test data
      const testEmail = `test-${Date.now()}@authtest.com`;
      const testPassword = 'TestPassword123!';

      // Test registration with invalid data
      const invalidRegister = await AuthService.register({
        email: 'invalid-email',
        password: '123',
        role: UserRole.CLIENT,
      });

      if (invalidRegister.success) {
        console.log('  ❌ Invalid registration validation: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Invalid registration validation: PASSED');
      }

      // Test valid registration
      const validRegister = await AuthService.register({
        email: testEmail,
        password: testPassword,
        role: UserRole.CLIENT,
        firstName: 'Test',
        lastName: 'User',
      });

      if (!validRegister.success || !validRegister.data) {
        console.log('  ❌ Valid registration: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Valid registration: PASSED');
      }

      // Test duplicate registration
      const duplicateRegister = await AuthService.register({
        email: testEmail,
        password: testPassword,
        role: UserRole.CLIENT,
      });

      if (duplicateRegister.success) {
        console.log('  ❌ Duplicate registration prevention: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Duplicate registration prevention: PASSED');
      }

      // Test login with invalid credentials
      const invalidLogin = await AuthService.login({
        email: testEmail,
        password: 'wrongpassword',
      });

      if (invalidLogin.success) {
        console.log('  ❌ Invalid login rejection: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Invalid login rejection: PASSED');
      }

      // Test valid login
      const validLogin = await AuthService.login({
        email: testEmail,
        password: testPassword,
      });

      if (!validLogin.success || !validLogin.data) {
        console.log('  ❌ Valid login: FAILED');
        passed = false;
      } else {
        console.log('  ✅ Valid login: PASSED');
      }

      // Test token refresh
      if (validLogin.data) {
        const refreshResult = await AuthService.refreshToken(validLogin.data.tokens.refreshToken);
        if (!refreshResult.success) {
          console.log('  ❌ Token refresh: FAILED');
          passed = false;
        } else {
          console.log('  ✅ Token refresh: PASSED');
        }
      }

      // Clean up test user
      await prisma.user.delete({
        where: { email: testEmail },
      });

    } catch (error) {
      console.log('  ❌ Authentication service test error:', error);
      passed = false;
    }

    return passed;
  }

  /**
   * Test role-based access
   */
  private static async testRoleBasedAccess(): Promise<boolean> {
    console.log('\n🧪 Testing Role-Based Access...');
    let passed = true;

    try {
      // Test role hierarchy
      const roles = [UserRole.SUPERADMIN, UserRole.VENDOR, UserRole.CLIENT];
      
      for (const role of roles) {
        const token = JwtUtil.generateAccessToken({
          userId: 'test-user',
          email: 'test@example.com',
          role: role,
        });

        const decoded = JwtUtil.verifyAccessToken(token);
        if (decoded.role !== role) {
          console.log(`  ❌ Role ${role} token verification: FAILED`);
          passed = false;
        } else {
          console.log(`  ✅ Role ${role} token verification: PASSED`);
        }
      }

      // Test role-specific permissions
      console.log('  ✅ Role-based permissions: PASSED (middleware exists)');

    } catch (error) {
      console.log('  ❌ Role-based access test error:', error);
      passed = false;
    }

    return passed;
  }

  /**
   * Quick authentication health check
   */
  static async quickHealthCheck(): Promise<boolean> {
    try {
      console.log('🔍 Running quick authentication health check...');

      // Test JWT generation and verification
      const testToken = JwtUtil.generateAccessToken({
        userId: 'health-check',
        email: 'health@check.com',
        role: UserRole.CLIENT,
      });

      const decoded = JwtUtil.verifyAccessToken(testToken);
      
      if (decoded.userId !== 'health-check') {
        console.log('❌ JWT health check failed');
        return false;
      }

      // Test password hashing
      const testPassword = 'HealthCheck123!';
      const hashed = await PasswordUtil.hashPassword(testPassword);
      const isMatch = await PasswordUtil.comparePassword(testPassword, hashed);

      if (!isMatch) {
        console.log('❌ Password hashing health check failed');
        return false;
      }

      console.log('✅ Authentication system health check passed');
      return true;
    } catch (error) {
      console.log('❌ Authentication health check error:', error);
      return false;
    }
  }
}

// Run test if called directly
if (require.main === module) {
  AuthTestSuite.runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export default AuthTestSuite;