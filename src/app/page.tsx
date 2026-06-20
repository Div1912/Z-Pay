"use client";

import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import QuickActions from "@/components/sections/QuickActions";
import AgenticSection from "@/components/sections/AgenticSection";
import CardsSection from "@/components/sections/CardsSection";
import LargePayments from "@/components/sections/LargePayments";
import Testimonials from "@/components/sections/Testimonials";
import Integrations from "@/components/sections/Integrations";
import FooterCTA from "@/components/sections/FooterCTA";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-[family-name:var(--font-jakarta)]">
      <Navbar />
      <Hero />
      <QuickActions />
      <AgenticSection />
      <CardsSection />
      <LargePayments />
      <Testimonials />
      <Integrations />
      <FooterCTA />
    </main>
  );
}
