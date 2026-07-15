"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Logo({ className = "", showText = true, size = "default" }: { className?: string; showText?: boolean; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-14 h-14"
  };

  const textSizeClasses = {
    small: "text-lg",
    default: "text-2xl",
    large: "text-3xl"
  };

  const AnimatedZpLogo = () => (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} group cursor-pointer`} style={{ perspective: '800px' }}>
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{
          rotateY: [0, 20, 0, -20, 0],
          rotateX: [0, -10, 0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Shadow Layer */}
        <svg viewBox="0 0 100 100" className="absolute w-full h-full text-black/50 blur-sm" style={{ transform: 'translateZ(-10px) translateY(4px) translateX(4px)' }}>
           <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-syne), sans-serif" fontWeight="900" fontSize="70" fontStyle="italic" letterSpacing="-8" fill="currentColor">Zp</text>
        </svg>

        {/* 3D Extrusion Layers (Dark Silver) */}
        {[...Array(8)].map((_, i) => (
          <svg key={i} viewBox="0 0 100 100" className="absolute w-full h-full" style={{ transform: `translateZ(${-i * 1.5}px)` }}>
            <defs>
              <linearGradient id={`ext-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#09090b" />
              </linearGradient>
            </defs>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-syne), sans-serif" fontWeight="900" fontSize="70" fontStyle="italic" letterSpacing="-8" fill={`url(#ext-grad-${i})`} stroke="#18181b" strokeWidth="1">Zp</text>
          </svg>
        ))}

        {/* Front Face (Metallic Silver/Rose Gold) */}
        <svg viewBox="0 0 100 100" className="absolute w-full h-full" style={{ transform: `translateZ(2px)` }}>
          <defs>
            <linearGradient id="front-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4f4f5" />
              <stop offset="30%" stopColor="#a1a1aa" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>
            <linearGradient id="stroke-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <text 
            x="50%" 
            y="55%" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            fontFamily="var(--font-syne), sans-serif" 
            fontWeight="900" 
            fontSize="70" 
            fontStyle="italic" 
            letterSpacing="-8" 
            fill="url(#front-grad)" 
            stroke="url(#stroke-grad)" 
            strokeWidth="1.5"
          >
            Zp
          </text>
        </svg>

        {/* Animated Light Sweep (Shimmer) */}
        <motion.div
          className="absolute top-0 w-[40%] h-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-45deg]"
          animate={{ left: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          style={{ left: "-100%", transform: 'translateZ(4px)' }}
        />
      </motion.div>
    </div>
  );

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <AnimatedZpLogo />
      {showText && (
        <span 
          className={`text-white font-black ${textSizeClasses[size]} tracking-tighter`}
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          ZPAY
        </span>
      )}
    </div>
  );
}
