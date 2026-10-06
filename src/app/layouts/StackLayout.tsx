import React from 'react';
import { Outlet } from 'react-router-dom';

export const StackLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-bg-primary">
      <Outlet />
    </div>
  );
};
