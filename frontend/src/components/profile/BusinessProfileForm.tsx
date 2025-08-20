'use client';

import { useState, useEffect } from 'react';
import { BusinessProfileFormData, Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building2, Globe, Phone, MapPin, Clock, Users, AlertTriangle } from 'lucide-react';

interface BusinessProfileFormProps {
  initialData?: Partial<Vendor>;
  onSubmit: (data: BusinessProfileFormData) => Promise<void>;
  loading?: boolean;
}

const businessTypes = [
  'Event Organizer',
  'Wedding Organizer',
  'Catering Service',
  'Photography Service',
  'Decoration Service',
  'Sound System Rental',
  'Venue Rental',
  'Transportation Service',
  'Entertainment Service',
  'Other'
];

const bankList = [
  'Bank Mandiri',
  'Bank BCA',
  'Bank BNI',
  'Bank BRI',
  'Bank CIMB Niaga',
  'Bank Danamon',
  'Bank Permata',
  'Bank OCBC NISP',
  'Bank Maybank',
  'Bank BTPN',
  'Other'
];

export function BusinessProfileForm({ initialData, onSubmit, loading = false }: BusinessProfileFormProps) {
  const [formData, setFormData] = useState<BusinessProfileFormData>({
    businessName: initialData?.businessName || '',
    businessType: initialData?.businessType || '',
    website: initialData?.website || '',
    whatsappNumber: initialData?.whatsappNumber || '',
    establishedYear: initialData?.establishedYear,
    businessAddress: initialData?.businessAddress || '',
    description: initialData?.description || '',
    businessHours: initialData?.businessHours || '',
    teamSize: initialData?.teamSize,
    emergencyContact: initialData?.emergencyContact || '',
    bankAccount: initialData?.bankAccount || '',
    bankName: initialData?.bankName || '',
    accountHolderName: initialData?.accountHolderName || '',
  });

  const [errors, setErrors] = useState<Partial<BusinessProfileFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BusinessProfileFormData> = {};

    // Required fields validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Business description is required';
    }

    if (!formData.businessHours.trim()) {
      newErrors.businessHours = 'Business hours are required';
    }

    // WhatsApp number validation
    if (formData.whatsappNumber && !/^(\+62|62|0)[0-9]{9,13}$/.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      newErrors.whatsappNumber = 'Please enter a valid Indonesian phone number';
    }

    // Website validation
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    // Established year validation
    if (formData.establishedYear && (formData.establishedYear < 1900 || formData.establishedYear > new Date().getFullYear())) {
      newErrors.establishedYear = 'Please enter a valid year';
    }

    // Team size validation
    if (formData.teamSize && (formData.teamSize < 1 || formData.teamSize > 1000)) {
      newErrors.teamSize = 'Team size must be between 1 and 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof BusinessProfileFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Business Information
          </CardTitle>
          <CardDescription>
            Essential details about your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Enter your business name"
                className={errors.businessName ? 'border-red-500' : ''}
              />
              {errors.businessName && (
                <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className={`w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.businessType ? 'border-red-500' : ''
                }`}
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p className="text-sm text-red-500 mt-1">{errors.businessType}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input
                id="establishedYear"
                type="number"
                value={formData.establishedYear || ''}
                onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value) || 0)}
                placeholder="e.g., 2020"
                min="1900"
                max={new Date().getFullYear()}
                className={errors.establishedYear ? 'border-red-500' : ''}
              />
              {errors.establishedYear && (
                <p className="text-sm text-red-500 mt-1">{errors.establishedYear}</p>
              )}
            </div>

            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                type="number"
                value={formData.teamSize || ''}
                onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
                placeholder="Number of team members"
                min="1"
                max="1000"
                className={errors.teamSize ? 'border-red-500' : ''}
              />
              {errors.teamSize && (
                <p className="text-sm text-red-500 mt-1">{errors.teamSize}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Business Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your business, services, and what makes you unique..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            How clients can reach you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="e.g., +62812345678"
                className={errors.whatsappNumber ? 'border-red-500' : ''}
              />
              {errors.whatsappNumber && (
                <p className="text-sm text-red-500 mt-1">{errors.whatsappNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://your-website.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-sm text-red-500 mt-1">{errors.website}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Emergency contact number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Address & Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location & Operating Hours
          </CardTitle>
          <CardDescription>
            Where and when you operate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessAddress">Business Address *</Label>
            <Textarea
              id="businessAddress"
              value={formData.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              placeholder="Enter your complete business address"
              rows={3}
              className={errors.businessAddress ? 'border-red-500' : ''}
            />
            {errors.businessAddress && (
              <p className="text-sm text-red-500 mt-1">{errors.businessAddress}</p>
            )}
          </div>

          <div>
            <Label htmlFor="businessHours">Business Hours *</Label>
            <Input
              id="businessHours"
              value={formData.businessHours}
              onChange={(e) => handleInputChange('businessHours', e.target.value)}
              placeholder="e.g., Mon-Fri 9AM-6PM, Sat 9AM-3PM"
              className={errors.businessHours ? 'border-red-500' : ''}
            />
            {errors.businessHours && (
              <p className="text-sm text-red-500 mt-1">{errors.businessHours}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banking Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Banking Information
          </CardTitle>
          <CardDescription>
            For payment processing (optional but recommended)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <select
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select bank</option>
                {bankList.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                id="accountHolderName"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                placeholder="Name as on bank account"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bankAccount">Bank Account Number</Label>
            <Input
              id="bankAccount"
              value={formData.bankAccount}
              onChange={(e) => handleInputChange('bankAccount', e.target.value)}
              placeholder="Your bank account number"
            />
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your banking information is securely stored and only used for payment processing. 
              This information helps clients trust your business and enables faster payments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Business Profile
        </Button>
      </div>
    </form>
  );
}