"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Configure GSAP for maximum performance
gsap.config({
  force3D: true,       // Always use 3D transforms (GPU compositing)
  nullTargetWarn: false,
});

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,              // Slightly faster — snappier feel
      easing: (t) => 1 - Math.pow(1 - t, 3), // Ease out cubic — natural decel
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,         // Native feel
      touchMultiplier: 1.5,       // Responsive touch
      infinite: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger via the shared ticker
    lenis.on("scroll", ScrollTrigger.update);

    // Use gsap.ticker for the RAF loop — single RAF, not two competing ones
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing — prevents frame skips

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
