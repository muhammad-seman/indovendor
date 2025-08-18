import bcrypt from 'bcrypt';

/**
 * Password utility functions using bcrypt
 */
export class PasswordUtil {
  // Salt rounds for bcrypt (higher = more secure but slower)
  private static readonly SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

  /**
   * Hash a plain text password
   * @param plainPassword - The plain text password to hash
   * @returns Promise<string> - The hashed password
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    try {
      if (!plainPassword || plainPassword.trim().length === 0) {
        throw new Error('Password cannot be empty');
      }

      // Validate password strength (basic validation)
      if (plainPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const hashedPassword = await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
      return hashedPassword;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Compare a plain text password with a hashed password
   * @param plainPassword - The plain text password to verify
   * @param hashedPassword - The hashed password to compare against
   * @returns Promise<boolean> - True if passwords match, false otherwise
   */
  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      if (!plainPassword || !hashedPassword) {
        return false;
      }

      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('Password comparison error:', error);
      return false;
    }
  }

  /**
   * Validate password strength
   * @param password - The password to validate
   * @returns Object with validation result and messages
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number; // 0-5 (0 = very weak, 5 = very strong)
  } {
    const errors: string[] = [];
    let score = 0;

    if (!password) {
      return { isValid: false, errors: ['Password is required'], score: 0 };
    }

    // Length validation
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    } else if (password.length >= 8) {
      score += 1;
      if (password.length >= 12) {
        score += 1;
      }
    }

    // Character type validation
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasLowercase) score += 0.5;
    if (hasUppercase) score += 0.5;
    if (hasNumbers) score += 0.5;
    if (hasSpecialChars) score += 0.5;

    // Strength requirements
    if (!hasLowercase && !hasUppercase) {
      errors.push('Password must contain at least one letter');
    }

    // Common password patterns (weak)
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /letmein/i,
    ];

    const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
    if (hasCommonPattern) {
      errors.push('Password contains common patterns and is easily guessable');
      score = Math.max(0, score - 2);
    }

    // Sequential characters
    const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
    if (hasSequential) {
      errors.push('Password contains sequential characters');
      score = Math.max(0, score - 1);
    }

    // Repeated characters
    const hasRepeated = /(.)\1{2,}/.test(password);
    if (hasRepeated) {
      errors.push('Password contains too many repeated characters');
      score = Math.max(0, score - 1);
    }

    // Cap the score at 5
    score = Math.min(5, Math.round(score));

    return {
      isValid: errors.length === 0 && password.length >= 6,
      errors,
      score,
    };
  }

  /**
   * Generate a random password
   * @param length - Length of the password (default: 12)
   * @param includeSpecialChars - Whether to include special characters
   * @returns string - The generated password
   */
  static generateRandomPassword(length: number = 12, includeSpecialChars: boolean = true): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = lowercase + uppercase + numbers;
    if (includeSpecialChars) {
      chars += specialChars;
    }

    let password = '';
    
    // Ensure at least one character from each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    
    if (includeSpecialChars) {
      password += specialChars[Math.floor(Math.random() * specialChars.length)];
    }

    // Fill the rest randomly
    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Check if password needs rehashing (useful for upgrading salt rounds)
   * @param hashedPassword - The hashed password to check
   * @returns boolean - True if password needs rehashing
   */
  static needsRehash(hashedPassword: string): boolean {
    try {
      // Extract the cost factor from the hash
      const cost = bcrypt.getRounds(hashedPassword);
      return cost < this.SALT_ROUNDS;
    } catch (error) {
      // If we can't parse the hash, assume it needs rehashing
      return true;
    }
  }

  /**
   * Get password strength text
   * @param score - The password strength score (0-5)
   * @returns string - Human readable strength description
   */
  static getPasswordStrengthText(score: number): string {
    switch (score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return 'Unknown';
    }
  }
}

export default PasswordUtil;