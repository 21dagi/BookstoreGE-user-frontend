import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from '@/shared/ui/Toast';
import { OfflineBanner } from '@/shared/ui/OfflineBanner';
import { useTheme } from '@/shared/theme';
import { SplashScreen } from '@/shared/components/display/SplashScreen';

export const AppShell: React.FC = () => {
  useTheme(); // Synchronizes document attributes and Telegram theme
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0D0A0B] text-text-primary antialiased flex justify-center">
      <div className="w-full max-w-[440px] min-h-screen bg-bg-primary text-text-primary flex flex-col relative shadow-[0_0_60px_rgba(0,0,0,0.6)] sm:border-x sm:border-border-subtle/30 overflow-x-hidden">
        {!splashDone && <SplashScreen onFinish={handleSplashFinish} />}
        <OfflineBanner />
        <ToastContainer />
        <div className="flex-1 w-full flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
