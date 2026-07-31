"use client";

import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import dynamic from 'next/dynamic';

const StatsBar = dynamic(() => import('@/components/sections/StatsBar'), { ssr: false });
const QuickActions = dynamic(() => import('@/components/sections/QuickActions'), { ssr: false });
const AgenticSection = dynamic(() => import('@/components/sections/AgenticSection'), { ssr: false });
const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks'), { ssr: false });
const CardsSection = dynamic(() => import('@/components/sections/CardsSection'), { ssr: false });
const LargePayments = dynamic(() => import('@/components/sections/LargePayments'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), { ssr: false });
const Integrations = dynamic(() => import('@/components/sections/Integrations'), { ssr: false });
const FooterCTA = dynamic(() => import('@/components/sections/FooterCTA'), { ssr: false });

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-[family-name:var(--font-jakarta)]">
      <Navbar />
      <Hero />
      <StatsBar />
      <QuickActions />
      <AgenticSection />
      <HowItWorks />
      <CardsSection />
      <LargePayments />
      <Testimonials />
      <Integrations />
      <FooterCTA />
    </main>
  );
}
