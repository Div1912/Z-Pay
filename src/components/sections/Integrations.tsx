"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import { Spotlight } from "@/components/ui/spotlight";
import Link from 'next/link';

// ─── Logo Components ────────────────────────────────────────────────────────

const StellarLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#080808" />
    <path d="M16 6L18.2 13.8L26 16L18.2 18.2L16 26L13.8 18.2L6 16L13.8 13.8L16 6Z" fill="#FFFFFF" />
    <circle cx="16" cy="16" r="2.5" fill="#080808" />
  </svg>
);

const StripeLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#635BFF" />
    <path d="M15 12.6c0-.9.8-1.3 1.9-1.3 1.7 0 3.8.6 5.5 1.6V8.7c-1.8-.7-3.6-1-5.5-1-4.4 0-7.4 2.3-7.4 6.2 0 6.1 8.4 5.1 8.4 7.8 0 1.1-1 1.4-2.2 1.4-1.9 0-4.5-.8-6.4-1.9v4.4c2.1.9 4.3 1.4 6.4 1.4 4.5 0 7.7-2.2 7.7-6.2-.1-6.5-8.4-5.5-8.4-7.8z" fill="#FFFFFF" />
  </svg>
);

const PayPalLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#003087" />
    <path d="M21.5 11.2c-.7 3.3-2.8 5-6.2 5h-1.6c-.4 0-.7.3-.8.6L11.5 22c0 .3.2.5.5.5h3.1c.3 0 .6-.3.7-.5l.4-2.7c0-.3.3-.5.7-.5h.4c3 0 5.3-1.2 6-4.6.3-1.4.1-2.6-.7-3.5z" fill="#0079C1" />
    <path d="M11 9c-.3 0-.6.3-.7.6L7.5 19c0 .3.2.5.5.5h3.7l1.3-6.5c.1-.4.4-.6.8-.6h1.7c3.3 0 5.8-1.4 6.6-5.2.1-.3.1-.5.1-.8-.8-.5-1.8-.6-2.9-.6H11z" fill="#FFFFFF" />
  </svg>
);

const ApplePayLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#000000" stroke="#333333" strokeWidth="1" />
    <path d="M12.8 11.2c-.4.5-1.1.9-1.7.9-.1-.6.2-1.3.6-1.7.4-.5 1.1-.8 1.6-.9.1.6-.1 1.2-.5 1.7zm.5 1c-.9 0-1.7.5-2.1.5-.5 0-1.1-.5-1.9-.5-.9 0-1.9.6-2.3 1.5-1 1.7-.3 4.2.7 5.6.5.7 1 1.5 1.7 1.5.7 0 1-.5 1.8-.5.8 0 1 .5 1.8.5.7 0 1.2-.7 1.7-1.4.6-.8.8-1.6.8-1.7-.1 0-1.5-.6-1.5-2.2 0-1.4 1.1-2 1.2-2.1-.7-1-1.7-1.1-2-1.1z" fill="#FFFFFF" />
    <text x="17.5" y="19" fill="#FFFFFF" fontSize="7.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">Pay</text>
  </svg>
);

const GooglePayLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#FFFFFF" />
    <path d="M11.5 16c0-.3 0-.6-.1-.9h-3.9v1.7h2.2c-.1.5-.4 1-.8 1.3v1.1h1.4c.8-.8 1.2-1.9 1.2-3.2z" fill="#4285F4" />
    <path d="M7.5 20c1.2 0 2.2-.4 2.9-1.1l-1.4-1.1c-.4.3-.9.5-1.5.5-1.1 0-2.1-.8-2.4-1.8H3.6v1.1C4.4 19.3 5.8 20 7.5 20z" fill="#34A853" />
    <path d="M5.1 16.5c-.1-.3-.1-.6-.1-.9s0-.6.1-.9V13.6H3.6C3.3 14.3 3.1 15.1 3.1 16s.2 1.7.5 2.4l1.5-1.9z" fill="#FBBC05" />
    <path d="M7.5 13c.7 0 1.2.2 1.7.6l1.3-1.3C9.7 11.5 8.7 11.1 7.5 11.1c-1.7 0-3.1.7-3.9 2.5l1.5 1.2c.3-1 1.3-1.8 2.4-1.8z" fill="#EA4335" />
    <text x="14.5" y="19" fill="#5F6368" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">Pay</text>
  </svg>
);

const CircleLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#2775CA" />
    <circle cx="16" cy="16" r="8" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
    <path d="M16 11v10M14 13.5h3.5c.8 0 1.5.5 1.5 1.2 0 .8-.7 1.3-1.5 1.3H14h4c.8 0 1.5.5 1.5 1.3 0 .7-.7 1.2-1.5 1.2H14" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const WiseLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#9FE870" />
    <path d="M11 22l5.5-12h-4.5l-2 4.5h3L11 22zm5-4.5l2-4.5h4.5L17 22l-1-4.5z" fill="#163300" />
  </svg>
);

const BitcoinLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#F7931A" />
    <path d="M21 14.5c.3-1.8-1.1-2.8-3-3.4l.6-2.4-1.5-.4-.6 2.3c-.4-.1-.8-.2-1.2-.3l.6-2.3-1.5-.4-.6 2.4-1-.2v-.1l-2-.5-.4 1.6s1 .2 1 .3c.6.2.7.5.7.9l-.7 2.8v.1l-1 4c-.1.2-.3.4-.6.3 0 0-1-.2-1-.2l-.7 1.7 1.9.5c.4.1.7.2 1.1.3l-.6 2.5 1.5.4.6-2.4c.4.1.8.2 1.2.3l-.6 2.4 1.5.4.6-2.5c2.5.5 4.4.3 5.2-2 .7-1.8-.1-2.9-1.3-3.5 1-.3 1.7-1 1.9-2.3zm-3.3 4.7c-.5 1.8-3.6.8-4.6.6l.8-3.3c1 .2 4.3.7 3.8 2.7zm.5-4.7c-.4 1.6-3 .8-3.8.6l.7-3c.8.2 3.5.5 3.1 2.4z" fill="#FFFFFF" />
  </svg>
);

const BankLogo = () => (
  <svg viewBox="0 0 32 32" className="w-full h-full">
    <rect width="32" height="32" rx="7" fill="#1E293B" />
    <path d="M16 8l8 4.5v1.5H8V12.5L16 8zm-6 8h2.5v5H10v-5zm4.7 0h2.5v5h-2.5v-5zm4.8 0H22v5h-2.5v-5zM8 22.5h16V24H8v-1.5z" fill="#FFFFFF" />
  </svg>
);

// ─── Orbit data ──────────────────────────────────────────────────────────────

const orbit1Icons = [
  { name: "Stellar", Logo: StellarLogo, angle: 0 },
  { name: "Stripe", Logo: StripeLogo, angle: 72 },
  { name: "PayPal", Logo: PayPalLogo, angle: 144 },
  { name: "Apple", Logo: ApplePayLogo, angle: 216 },
  { name: "Google", Logo: GooglePayLogo, angle: 288 },
];

const orbit2Icons = [
  { name: "Circle", Logo: CircleLogo, angle: 30 },
  { name: "Wise", Logo: WiseLogo, angle: 120 },
  { name: "Bitcoin", Logo: BitcoinLogo, angle: 210 },
  { name: "Bank", Logo: BankLogo, angle: 300 },
];

// ─── CSS-based orbit (zero JS re-renders per second) ─────────────────────────

/**
 * Pure CSS orbit approach:
 * - The ring wrapper div rotates via CSS animation
 * - Each icon counter-rotates via CSS animation to stay upright
 * - Zero setInterval, zero useState, zero React re-renders per second
 */
const CSSOrbitIcon = ({
  icon,
  radiusPercent,
  orbitDuration,
  counterRotate,
}: {
  icon: { name: string; Logo: React.FC; angle: number };
  radiusPercent: number;
  orbitDuration: number;
  counterRotate: boolean;
}) => {
  // Position on orbit using the initial angle only — CSS handles the rotation
  const angleRad = (icon.angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * radiusPercent;
  const y = Math.sin(angleRad) * radiusPercent;

  const spinKeyframe = counterRotate
    ? 'zpay-spin-ccw'
    : 'zpay-spin-cw';

  return (
    <div
      className="absolute group"
      style={{
        left: `calc(50% + ${x}%)`,
        top: `calc(50% + ${y}%)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Counter-rotate the icon itself so it stays upright */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: icon.angle / 360 }}
        style={{
          animation: `${spinKeyframe} ${orbitDuration}s linear infinite`,
        }}
      >
        <div className="w-10 sm:w-12 md:w-14 lg:w-16 aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/20 bg-black/80 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform cursor-pointer overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-6 sm:w-7 md:w-8 lg:w-9 aspect-square">
            <icon.Logo />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main section ─────────────────────────────────────────────────────────────

const Integrations = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black py-20 sm:py-28 md:py-40 lg:py-56"
    >
      {/*
        CSS keyframe definitions injected inline — keeps everything self-contained.
        orbit ring divs rotate CW/CCW, icons counter-rotate to stay upright.
      */}
      <style>{`
        @keyframes zpay-orbit-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes zpay-orbit-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes zpay-spin-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes zpay-spin-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1200px] aspect-square rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[180px] md:blur-[250px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-5 sm:mb-6 md:mb-8">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#a3a3a3] shadow-[0_0_10px_#a3a3a3]" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60">Ecosystem</span>
          </div>
          
          <h2 className="font-black leading-[0.9] tracking-tight mb-5 sm:mb-6 md:mb-8">
            <span className="block text-white text-[10vw] sm:text-[9vw] md:text-[8vw] lg:text-[5.5vw] xl:text-[5rem]">Integrate with</span>
            <span className="block text-zinc-400 text-[10vw] sm:text-[9vw] md:text-[8vw] lg:text-[5.5vw] xl:text-[5rem]">any apps</span>
          </h2>
          
          <p className="text-white/50 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed">
            Connect with your favorite payment platforms, banks, and crypto networks seamlessly.
          </p>
          
          <LiquidMetalButton label="Request Access" href="/waitlist" />
        </motion.div>

        {/* Orbit container — pure CSS rotation, no JS timers */}
        <div className="relative w-full max-w-[300px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[800px] aspect-square mx-auto">

          {/* Static orbit ring visuals */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[30%] aspect-square border border-white/[0.08] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.02)]" />
            <div className="absolute w-[50%] aspect-square border border-white/[0.1] rounded-full shadow-[0_0_25px_rgba(255,255,255,0.03)]" />
            <div className="absolute w-[70%] aspect-square border border-white/[0.12] rounded-full shadow-[0_0_35px_rgba(255,255,255,0.04)]" />
            <div className="absolute w-[90%] aspect-square border border-white/[0.08] rounded-full shadow-[0_0_45px_rgba(255,255,255,0.02)]" />
          </div>

          {/*
            Outer orbit (orbit1): CW rotation
            The ring div itself rotates; icons counter-rotate to stay upright.
            This means zero useState and zero setInterval — only GPU-composited CSS.
          */}
          <div
            className="absolute inset-0"
            style={{ animation: 'zpay-orbit-cw 22s linear infinite' }}
          >
            {orbit1Icons.map((icon) => (
              <CSSOrbitIcon
                key={icon.name}
                icon={icon}
                radiusPercent={35}
                orbitDuration={22}
                counterRotate={false}
              />
            ))}
          </div>

          {/*
            Inner orbit (orbit2): CCW rotation
          */}
          <div
            className="absolute inset-0"
            style={{ animation: 'zpay-orbit-ccw 16s linear infinite' }}
          >
            {orbit2Icons.map((icon) => (
              <CSSOrbitIcon
                key={icon.name}
                icon={icon}
                radiusPercent={22}
                orbitDuration={16}
                counterRotate={true}
              />
            ))}
          </div>

          {/* Center Z logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="w-16 sm:w-20 md:w-24 lg:w-28 aspect-square rounded-2xl sm:rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_15px_30px_rgba(255,255,255,0.05)] p-0.5 sm:p-1">
              <div className="w-full h-full rounded-[14px] sm:rounded-[20px] bg-[#0A0A0A] flex items-center justify-center">
                <span className="text-white font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl">Z</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-12 sm:mt-16 md:mt-20"
        >
          {["Stellar", "Circle", "Wise", "Stripe", "PayPal", "Apple Pay", "Google Pay", "Bitcoin"].map((name) => (
            <span
              key={name}
              className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs sm:text-sm text-white/60 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all cursor-pointer"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Integrations;
