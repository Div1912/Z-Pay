"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Logo({ className = "w-8 h-8", size }: { className?: string; size?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className} group cursor-pointer`}>
      {/* Ethereal Glow */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl blur-lg"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Solid Black Glass Block */}
      <div className="relative w-full h-full bg-black rounded-xl border border-white/20 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:border-white/40 transition-colors duration-300">
        
        {/* Animated Light Sweep (Shimmer) */}
        <motion.div
          className="absolute top-0 w-[50px] h-[200%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-45deg]"
          animate={{ left: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          style={{ left: "-100%" }}
        />
        
        {/* The 'Z' */}
        <Image 
          src="/logo.png"
          alt="Zpay Logo"
          fill
          className="object-cover relative z-10"
        />
      </div>
    </div>
  );
}
