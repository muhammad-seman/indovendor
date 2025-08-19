'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../contexts/AuthContext';
import { UserRole } from '../../../types';

const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['VENDOR', 'CLIENT'], {
    message: 'Please select a role',
  }),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: 'CLIENT' as const,
    title: 'Client',
    description: 'I want to find and hire event organizers',
    icon: '👤',
  },
  {
    value: 'VENDOR' as const,
    title: 'Vendor',
    description: 'I provide event organizing services',
    icon: '🏪',
  },
];

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();
  const [registrationError, setRegistrationError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'CLIENT',
      terms: false,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setRegistrationError('');
      
      const result = await registerUser({
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      if (result.success) {
        // Redirect to appropriate dashboard
        router.push('/dashboard');
      } else {
        setRegistrationError(result.message);
      }
    } catch (error) {
      setRegistrationError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: '#FEFEFE' }}>
      
      {/* Modern Batik Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #DFD0B8 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, #EEEBE5 0%, transparent 50%),
            radial-gradient(circle at 25% 75%, #F4F2EE 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #E7E3DA 0%, transparent 50%),
            linear-gradient(135deg, transparent 25%, #DFD0B8 25%, #DFD0B8 50%, transparent 50%, transparent 75%, #EEEBE5 75%),
            linear-gradient(45deg, transparent 25%, #F4F2EE 25%, #F4F2EE 50%, transparent 50%, transparent 75%, #E7E3DA 75%)
          `,
          backgroundSize: '100px 100px, 100px 100px, 100px 100px, 100px 100px, 60px 60px, 60px 60px',
          backgroundPosition: '0 0, 50px 0, 0 50px, 50px 50px, 0 0, 30px 30px'
        }}
      />
      
      {/* Decorative Elements - Different position than login */}
      <div className="absolute top-20 right-10 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,5 62,35 95,35 75,57 85,90 50,75 15,90 25,57 5,35 38,35" fill="#948979"/>
        </svg>
      </div>
      
      <div className="absolute bottom-16 left-8 w-20 h-20 opacity-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" rx="20" stroke="#222831" strokeWidth="2" fill="none"/>
          <circle cx="50" cy="50" r="15" fill="#DFD0B8"/>
          <circle cx="30" cy="30" r="5" fill="#393E46"/>
          <circle cx="70" cy="30" r="5" fill="#393E46"/>
        </svg>
      </div>
      
      <div className="absolute top-1/3 left-1/5 w-10 h-10 opacity-12 transform rotate-12">
        <div 
          className="w-full h-full rounded-full" 
          style={{ backgroundColor: '#948979' }}
        ></div>
      </div>
      
      <div className="absolute bottom-1/3 right-1/5 w-6 h-6 opacity-15 transform -rotate-12">
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundColor: '#393E46',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
        ></div>
      </div>

      {/* Register Card with Glass Effect */}
      <div className="max-w-md w-full relative z-10">
        <div 
          className="p-8 rounded-2xl shadow-2xl border backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(249, 248, 246, 0.85)',
            borderColor: 'rgba(223, 208, 184, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(34, 40, 49, 0.25), 0 0 0 1px rgba(223, 208, 184, 0.1)'
          }}
        >
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-800">
            <span className="text-2xl font-bold text-accent-50">IV</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#222831' }}>
            Join IndoVendor
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: '#525252' }}>
            Create your account to get started
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to join as:
            </label>
            <div className="space-y-3">
              {roleOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedRole === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setValue('role', option.value)}
                >
                  <div className="flex items-start">
                    <input
                      {...register('role')}
                      type="radio"
                      value={option.value}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{option.icon}</span>
                        <span className="font-medium text-gray-900">{option.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register('firstName')}
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register('lastName')}
                type="text"
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              autoComplete="new-password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}
          </div>

          {/* Error Message */}
          {registrationError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {registrationError}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm" style={{ color: '#525252' }}>
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium hover:underline transition-colors"
                style={{ color: '#222831' }}
                onMouseEnter={(e) => e.target.style.color = '#393E46'}
                onMouseLeave={(e) => e.target.style.color = '#222831'}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}