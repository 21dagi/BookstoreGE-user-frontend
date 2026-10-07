import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/shared/components/navigation';

export const TabLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 w-full pb-[90px]">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};
