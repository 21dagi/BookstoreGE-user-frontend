import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from '@/shared/ui/Toast';
import { OfflineBanner } from '@/shared/ui/OfflineBanner';
import { useTheme } from '@/shared/theme';

export const AppShell: React.FC = () => {
  useTheme(); // Synchronizes document attributes and Telegram theme

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary antialiased flex flex-col">
      <OfflineBanner />
      <ToastContainer />
      <div className="flex-1 w-full">
        <Outlet />
      </div>
    </div>
  );
};
