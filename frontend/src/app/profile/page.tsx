'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import DashboardLayout, { ActionButton } from '../../components/layout/DashboardLayout';
import { 
  BusinessProfileForm,
  CategorySelection,
  CoverageAreaSetting,
  BusinessDocumentUpload,
  ProfileView,
  ProfileEdit
} from '@/components/profile';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useRole } from '@/hooks/usePermissions';
import { BusinessProfileFormData, Vendor, UserWithProfile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Building2, 
  Tag, 
  MapPin, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Settings,
  Save
} from 'lucide-react';

type TabType = 'overview' | 'personal' | 'business' | 'categories' | 'coverage' | 'documents';
type ProfileMode = 'view' | 'edit';

function ProfileContent() {
  const { user } = useAuth();
  const { role } = useRole();
  const router = useRouter();
  const { profile, updateProfile, loading } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profileMode, setProfileMode] = useState<ProfileMode>('view');
  const [vendor, setVendor] = useState<Vendor | undefined>(undefined);

  // Initialize vendor data from user profile
  useEffect(() => {
    if (user && (user as UserWithProfile).vendor) {
      setVendor((user as UserWithProfile).vendor);
    }
  }, [user]);

  // Different tabs based on user role
  const getTabsForRole = () => {
    const baseTabs = [
      { id: 'overview' as TabType, label: 'Overview', icon: Eye },
      { id: 'personal' as TabType, label: 'Personal Info', icon: User },
    ];

    if (user?.role === 'VENDOR') {
      return [
        ...baseTabs,
        { id: 'business' as TabType, label: 'Business Profile', icon: Building2 },
        { id: 'categories' as TabType, label: 'Service Categories', icon: Tag },
        { id: 'coverage' as TabType, label: 'Coverage Areas', icon: MapPin },
        { id: 'documents' as TabType, label: 'Documents', icon: FileText },
      ];
    }

    return baseTabs;
  };

  const tabs = getTabsForRole();

  const handleBusinessProfileSubmit = async (data: BusinessProfileFormData) => {
    try {
      // Update vendor information
      const updatedVendor: Partial<Vendor> = {
        businessName: data.businessName,
        businessType: data.businessType,
        website: data.website,
        whatsappNumber: data.whatsappNumber,
        establishedYear: data.establishedYear,
        businessAddress: data.businessAddress,
        description: data.description,
        businessHours: data.businessHours,
        teamSize: data.teamSize,
        emergencyContact: data.emergencyContact,
        bankAccount: data.bankAccount,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
      };

      setVendor(prev => ({ ...prev, ...updatedVendor } as Vendor));
      
      // Show success message or handle API call here
      alert('Business profile updated successfully!');
    } catch (error) {
      console.error('Failed to update business profile:', error);
      alert('Failed to update business profile. Please try again.');
    }
  };

  const handleVendorUpdate = (updatedData: Partial<Vendor>) => {
    setVendor(prev => ({ ...prev, ...updatedData } as Vendor));
  };

  const getCompletionStatus = () => {
    if (user?.role !== 'VENDOR' || !vendor) return { percentage: 100, missingItems: [] };

    const items = [
      { key: 'businessName', label: 'Business Name' },
      { key: 'businessType', label: 'Business Type' },
      { key: 'description', label: 'Business Description' },
      { key: 'businessAddress', label: 'Business Address' },
      { key: 'businessHours', label: 'Business Hours' },
      { key: 'businessLicense', label: 'Business License' },
    ];

    const completed = items.filter(item => vendor[item.key as keyof Vendor]);
    const percentage = Math.round((completed.length / items.length) * 100);
    const missingItems = items.filter(item => !vendor[item.key as keyof Vendor]).map(item => item.label);

    return { percentage, missingItems };
  };

  const getVerificationStatusBadge = () => {
    if (user?.role !== 'VENDOR' || !vendor?.verificationStatus) return null;

    const statusConfig = {
      PENDING: { variant: 'secondary' as const, icon: AlertTriangle, text: 'Verification Pending' },
      VERIFIED: { variant: 'default' as const, icon: CheckCircle, text: 'Verified' },
      REJECTED: { variant: 'destructive' as const, icon: AlertTriangle, text: 'Verification Rejected' },
    };

    const config = statusConfig[vendor.verificationStatus];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        if (user?.role === 'VENDOR') {
          const { percentage, missingItems } = getCompletionStatus();
          return (
            <div className="space-y-6">
              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>
                    Complete your profile to attract more clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {missingItems.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Missing: {missingItems.join(', ')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Verification Status
                    {getVerificationStatusBadge()}
                  </CardTitle>
                  <CardDescription>
                    Verified vendors receive more trust from clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {vendor?.verificationStatus === 'VERIFIED' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Your account is verified! This badge will be displayed to clients.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {vendor?.verificationStatus === 'PENDING' && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Your verification is under review. We'll notify you once it's complete.
                      </AlertDescription>
                    </Alert>
                  )}

                  {(!vendor?.verificationStatus || vendor?.verificationStatus === 'REJECTED') && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Upload your business license in the Documents tab to start verification.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Active Services</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        } else {
          // For non-vendor users, show basic overview
          return (
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>
                  Welcome to your profile dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <strong>Role:</strong> {user?.role}
                  </div>
                  <div className="text-sm">
                    <strong>Email:</strong> {user?.email}
                  </div>
                  <div className="text-sm">
                    <strong>Status:</strong> {user?.isVerified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }

      case 'personal':
        return (
          <div>
            {profileMode === 'view' ? (
              <ProfileView onEdit={() => setProfileMode('edit')} />
            ) : (
              <ProfileEdit 
                onCancel={() => setProfileMode('view')} 
                onSave={() => setProfileMode('view')} 
              />
            )}
          </div>
        );

      case 'business':
        if (user?.role === 'VENDOR') {
          return (
            <BusinessProfileForm
              initialData={vendor}
              onSubmit={handleBusinessProfileSubmit}
              loading={loading}
            />
          );
        }
        return <div>This section is only available for vendors.</div>;

      case 'categories':
        if (user?.role === 'VENDOR') {
          return <CategorySelection onUpdate={() => {}} />;
        }
        return <div>This section is only available for vendors.</div>;

      case 'coverage':
        if (user?.role === 'VENDOR') {
          return <CoverageAreaSetting onUpdate={() => {}} />;
        }
        return <div>This section is only available for vendors.</div>;

      case 'documents':
        if (user?.role === 'VENDOR') {
          return (
            <BusinessDocumentUpload
              vendor={vendor}
              onUpdate={handleVendorUpdate}
            />
          );
        }
        return <div>This section is only available for vendors.</div>;

      default:
        return <div>Tab content not found</div>;
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'VENDOR':
        return 'Business Profile';
      case 'SUPERADMIN':
        return 'Admin Profile';
      case 'CLIENT':
        return 'My Profile';
      default:
        return 'Profile';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'VENDOR':
        return 'Manage your business profile, services, and verification status';
      case 'SUPERADMIN':
        return 'Manage your admin profile and system access';
      case 'CLIENT':
        return 'Manage your personal profile and preferences';
      default:
        return 'Manage your profile information';
    }
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile' },
  ];

  const headerActions = (
    <div className="flex items-center space-x-3">
      <ActionButton
        variant="outline"
        size="sm"
        onClick={() => router.push('/dashboard')}
      >
        <Settings className="w-4 h-4 mr-2" />
        Back to Dashboard
      </ActionButton>
      
      {activeTab === 'personal' && profileMode === 'view' && (
        <ActionButton
          variant="primary"
          size="sm"
          onClick={() => setProfileMode('edit')}
        >
          <User className="w-4 h-4 mr-2" />
          Edit Profile
        </ActionButton>
      )}

      {activeTab === 'personal' && profileMode === 'edit' && (
        <ActionButton
          variant="primary"
          size="sm"
          onClick={() => setProfileMode('view')}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </ActionButton>
      )}
    </div>
  );

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle={getPageDescription()}
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <ProfileContent />
    </ProtectedRoute>
  );
}