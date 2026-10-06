import React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/shared/lib';

export type IconName = keyof typeof LucideIcons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  'aria-label'?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className,
  'aria-label': ariaLabel,
  ...props
}) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<any>;

  if (!IconComponent) {
    return <LucideIcons.HelpCircle size={size} className={className} aria-hidden={!ariaLabel} />;
  }

  return (
    <IconComponent
      size={size}
      className={cn('shrink-0', className)}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      {...props}
    />
  );
};
