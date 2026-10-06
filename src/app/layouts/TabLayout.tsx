import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/shared/components/navigation';

export const TabLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col pb-16">
      <div className="flex-1 w-full">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};
