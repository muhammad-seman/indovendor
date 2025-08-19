'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { ProfileView } from '@/components/profile/ProfileView';
import { ProfileEdit } from '@/components/profile/ProfileEdit';

type ProfileMode = 'view' | 'edit';

const ClientProfilePage: React.FC = () => {
  const [mode, setMode] = useState<ProfileMode>('view');

  const handleEdit = () => {
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setMode('view');
  };

  const handleSaveEdit = () => {
    setMode('view');
  };

  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      {mode === 'view' ? (
        <ProfileView onEdit={handleEdit} />
      ) : (
        <ProfileEdit 
          onCancel={handleCancelEdit} 
          onSave={handleSaveEdit} 
        />
      )}
    </ProtectedRoute>
  );
};

export default ClientProfilePage;