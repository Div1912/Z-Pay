"use client";

import Navbar from "@/components/sections/Navbar";
import WaitlistHero from "@/components/sections/WaitlistHero";
import QuickActions from "@/components/sections/QuickActions";
import AgenticSection from "@/components/sections/AgenticSection";
import CardsSection from "@/components/sections/CardsSection";
import LargePayments from "@/components/sections/LargePayments";
import Testimonials from "@/components/sections/Testimonials";
import Integrations from "@/components/sections/Integrations";
import FooterCTA from "@/components/sections/FooterCTA";

export default function WaitlistContent() {
  return (
    <>
      <Navbar />
      <WaitlistHero />
      <QuickActions />
      <AgenticSection />
      <CardsSection />
      <LargePayments />
      <Testimonials />
      <Integrations />
      <FooterCTA />
    </>
  );
}
