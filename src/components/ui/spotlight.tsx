import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

export const Spotlight = ({ className, fill }: SpotlightProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-[1] h-[600px] w-[600px] rounded-full opacity-30 blur-[60px] gpu-accelerate",
        className
      )}
      style={{
        background: `radial-gradient(circle, ${fill || "rgba(255,255,255,0.25)"} 0%, transparent 70%)`,
        willChange: 'opacity, transform',
      }}
    />
  );
};
