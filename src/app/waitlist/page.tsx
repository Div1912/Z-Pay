import WaitlistNavbar from "@/components/sections/WaitlistNavbar";
import WaitlistHero from "@/components/sections/WaitlistHero";
import QuickActions from "@/components/sections/QuickActions";
import AgenticSection from "@/components/sections/AgenticSection";
import CardsSection from "@/components/sections/CardsSection";
import LargePayments from "@/components/sections/LargePayments";
import Testimonials from "@/components/sections/Testimonials";
import Integrations from "@/components/sections/Integrations";
import FooterCTA from "@/components/sections/FooterCTA";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Z-Pay | Join the Waitlist",
  description: "Join the waitlist for Z-Pay early access.",
};

export default function WaitlistPage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-[family-name:var(--font-jakarta)]">
      <WaitlistNavbar />
      <WaitlistHero />
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
