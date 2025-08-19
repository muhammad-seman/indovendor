'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('');
      const result = await login(data.email, data.password);

      if (result.success) {
        // Redirect to appropriate dashboard or home page
        router.push('/dashboard');
      } else {
        setLoginError(result.message);
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
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
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10L60 40L90 40L68 58L78 88L50 70L22 88L32 58L10 40L40 40Z" fill="#222831"/>
        </svg>
      </div>
      
      <div className="absolute bottom-10 right-10 w-16 h-16 opacity-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="#948979" strokeWidth="2" fill="none"/>
          <circle cx="50" cy="50" r="20" stroke="#393E46" strokeWidth="2" fill="none"/>
          <circle cx="50" cy="50" r="5" fill="#DFD0B8"/>
        </svg>
      </div>
      
      <div className="absolute top-1/4 right-1/4 w-12 h-12 opacity-10 transform rotate-45">
        <div className="w-full h-full" style={{ backgroundColor: '#948979' }}></div>
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 w-8 h-8 opacity-15 transform rotate-12">
        <div className="w-full h-full rounded-full" style={{ backgroundColor: '#393E46' }}></div>
      </div>
      {/* Login Card with Glass Effect */}
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-800">
            Sign in to IndoVendor
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Welcome back to the EO/WO marketplace
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: '#404040' }}>
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {loginError}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm" style={{ color: '#525252' }}>
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium hover:underline transition-colors"
                style={{ color: '#222831' }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#393E46'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#222831'}
              >
                Create your account
              </Link>
            </p>
          </div>
        </form>

        {/* Demo Credentials */}
        <div 
          className="border rounded-lg p-4"
          style={{ 
            backgroundColor: 'rgba(238, 235, 229, 0.5)', 
            borderColor: 'rgba(148, 137, 121, 0.2)' 
          }}
        >
          <p 
            className="text-xs mb-2 font-semibold"
            style={{ color: '#525252' }}
          >
            Demo Credentials:
          </p>
          <div className="space-y-1 text-xs" style={{ color: '#737373' }}>
            <p><strong>Admin:</strong> admin@indovendor.com / admin123</p>
            <p><strong>Vendor:</strong> vendor@indovendor.com / vendor123</p>
            <p><strong>Client:</strong> client@indovendor.com / client123</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}