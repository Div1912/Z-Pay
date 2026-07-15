"use client";

import React from "react";
import { motion } from "framer-motion";

export function Logo({ className = "w-8 h-8", size }: { className?: string; size?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className} group cursor-pointer`} style={{ perspective: '800px' }}>
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
          className="absolute top-0 w-[40px] h-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-45deg]"
          animate={{ left: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          style={{ left: "-100%", transform: 'translateZ(4px)' }}
        />
      </motion.div>
    </div>
  );
}
