import React from 'react';
import { cn } from '@/lib/utils';

interface GlowOrbProps {
  className?: string;
  color?: 'primary' | 'gold' | 'purple' | 'blue' | 'zinc';
  size?: string;
  position?: string;
  blur?: string;
  opacity?: string;
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  className,
  color = 'gold',
  size = 'w-[40vw] max-w-[400px] aspect-square',
  position = 'absolute top-1/4 left-1/4',
  blur = 'blur-[40px] md:blur-[50px]',
  opacity = 'opacity-40',
}) => {
  const colorMap = {
    primary: 'bg-primary/20',
    gold: 'bg-gold/20',
    purple: 'bg-purple-600/10',
    blue: 'bg-blue-600/10',
    zinc: 'bg-[#27272a]/20'
  };

  return (
    <div 
      className={cn(
        "rounded-full pointer-events-none z-0 gpu-accelerate",
        position,
        size,
        blur,
        opacity,
        colorMap[color],
        className
      )}
      style={{ willChange: 'transform' }}
    />
  );
};
