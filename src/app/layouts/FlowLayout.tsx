import React from 'react';
import { Outlet } from 'react-router-dom';

export const FlowLayout: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-bg-primary">
      <Outlet />
    </div>
  );
};
