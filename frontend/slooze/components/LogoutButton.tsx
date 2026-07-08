'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../api/auth';
import Button from './ui/Button';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call backend to clear HttpOnly cookie
      await logout();
    } catch (err) {
      console.error('Logout error on backend:', err);
    }
    
    // Redirect to login page
    router.push('/');
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
    >
      Log Out
    </Button>
  );
}
