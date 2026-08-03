"use client";

import Image from "next/image";

/**
 * Official ZPAY Logo — uses /images/Logo.png brand asset.
 * Used across dashboard, auth pages, and settings.
 */
export function Logo({
  className = "",
  showText = true,
  size = "default",
}: {
  className?: string;
  showText?: boolean;
  size?: "small" | "default" | "large";
}) {
  const sizePx: Record<string, number> = {
    small: 28,
    default: 36,
    large: 48,
  };

  const textSizeClass: Record<string, string> = {
    small: "text-lg",
    default: "text-2xl",
    large: "text-3xl",
  };

  const px = sizePx[size] ?? 36;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/Logo.png"
        alt="ZPAY Logo"
        width={px}
        height={px}
        className="rounded-full object-cover drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
        priority
      />
      {showText && (
        <span
          className={`text-white font-black ${textSizeClass[size]} tracking-tighter`}
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          ZPAY
        </span>
      )}
    </div>
  );
}

/**
 * Standalone logo icon — for compact spaces like collapsed sidebars.
 */
export function LogoIcon({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "small" | "default" | "large";
}) {
  const sizePx: Record<string, number> = {
    small: 24,
    default: 32,
    large: 40,
  };

  const px = sizePx[size] ?? 32;

  return (
    <Image
      src="/images/Logo.png"
      alt="ZPAY"
      width={px}
      height={px}
      className={`rounded-full object-cover drop-shadow-[0_0_8px_rgba(212,175,55,0.35)] ${className}`}
      priority
    />
  );
}
