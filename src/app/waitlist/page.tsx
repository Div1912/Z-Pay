import WaitlistContent from "./WaitlistContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Z-Pay | Join the Waitlist",
  description: "Join the waitlist for Z-Pay early access.",
};

export default function WaitlistPage() {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-[family-name:var(--font-jakarta)]">
      <WaitlistContent />
    </main>
  );
}
