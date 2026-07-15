"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "", showText = true, size = "default" }: { className?: string; showText?: boolean; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-7 h-7",
    default: "w-9 h-9",
    large: "w-12 h-12"
  };

  const textSizeClasses = {
    small: "text-lg",
    default: "text-2xl",
    large: "text-3xl"
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image 
          src="/logo.png"
          alt="Zpay Logo"
          fill
          className="object-contain"
        />
      </div>
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

export function LogoIcon({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-8 h-8",
    large: "w-10 h-10"
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image 
        src="/logo.png"
        alt="Zpay Logo"
        fill
        className="object-contain"
      />
    </div>
  );
}
