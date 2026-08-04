"use client";

import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import ProductShowcase from "@/components/sections/ProductShowcase";
import QuickActions from "@/components/sections/QuickActions";
import AgenticSection from "@/components/sections/AgenticSection";
import EscrowSection from "@/components/sections/EscrowSection";
import X402Section from "@/components/sections/X402Section";
import HowItWorks from "@/components/sections/HowItWorks";
import CardsSection from "@/components/sections/CardsSection";
import LargePayments from "@/components/sections/LargePayments";
import Testimonials from "@/components/sections/Testimonials";
import Integrations from "@/components/sections/Integrations";
import FAQ from "@/components/sections/FAQ";
import FooterCTA from "@/components/sections/FooterCTA";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-[family-name:var(--font-jakarta)]">
      <Navbar />
      <Hero />
      <StatsBar />
      <ProductShowcase />
      <QuickActions />
      <AgenticSection />
      <EscrowSection />
      <X402Section />
      <HowItWorks />
      <CardsSection />
      <LargePayments />
      <Testimonials />
      <Integrations />
      <FAQ />
      <FooterCTA />
    </main>
  );
}
