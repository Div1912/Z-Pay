"use client";

import React from 'react';
import Navbar from "@/components/sections/Navbar";
import FooterCTA from "@/components/sections/FooterCTA";
import { FileText } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the ZPAY payment routing protocol, web dashboard, developer SDKs, APIs, or any associated service (collectively the "Service"), you agree to be legally bound by these Terms of Service ("Terms") and all applicable laws and regulations.

If you are using the Service on behalf of an organization, you represent and warrant that you have authority to bind that organization to these Terms. If you do not agree with any provision of these Terms, you must discontinue use of the Service immediately.`
  },
  {
    title: '2. Non-Custodial Protocol',
    content: `ZPAY is a software protocol and payment routing infrastructure layer. We do not act as a bank, licensed financial institution, money transmitter, or custodian of your digital assets.

You maintain sole ownership and exclusive control over your private cryptographic keys, wallet seed phrases, and all digital assets associated with your accounts. ZPAY never has access to, possession of, or control over your private keys or funds. Loss of your private key credentials cannot be recovered by ZPAY.`
  },
  {
    title: '3. Eligibility',
    content: `You must be at least 18 years of age and legally capable of entering into binding contracts to use the Service. By using ZPAY, you represent and warrant that you meet these eligibility requirements.

Users located in jurisdictions where use of blockchain-based payment protocols is prohibited by applicable law are not permitted to use the Service.`
  },
  {
    title: '4. Acceptable Use Policy',
    content: `You agree to use the ZPAY Service only for lawful purposes and in compliance with all applicable laws. Prohibited uses include, but are not limited to:

• Money laundering, terrorist financing, or any activity in violation of AML/CFT regulations
• Circumventing or evading OFAC, EU, UN, or other international economic sanctions
• Fraud, phishing, identity theft, or misrepresentation of transaction counterparties
• Unauthorized access to or interference with the ZPAY API, protocol, or infrastructure
• Transmitting malware, ransomware, or any destructive code via the ZPAY SDK

ZPAY reserves the right to immediately suspend or terminate access to the Service for violations of this policy.`
  },
  {
    title: '5. Developer API & SDK Usage',
    content: `Access to the ZPAY developer API requires issuance of an API key from the ZPAY developer dashboard. API keys are issued per developer account and must not be shared, published in public repositories, or embedded in client-side code.

You are solely responsible for securing your API credentials. ZPAY will not be liable for unauthorized transactions resulting from compromised API keys due to developer negligence.

ZPAY reserves the right to rate-limit, throttle, or revoke API access without notice in cases of abuse, excessive load, or security risk.`
  },
  {
    title: '6. Fees & Protocol Economics',
    content: `ZPAY charges no additional fees on transactions beyond the native Stellar network base fee of approximately 0.00001 XLM per operation. ZPAY operates a fee-sponsorship model for gasless user transactions where applicable.

For enterprise smart contract deployments, custom fee arrangements may be negotiated separately. All fee schedules are disclosed transparently in the developer documentation at zpay.route/docs.`
  },
  {
    title: '7. Disclaimers & Limitation of Liability',
    content: `THE ZPAY SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

ZPAY DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM SECURITY VULNERABILITIES. BLOCKCHAIN TRANSACTIONS ARE IRREVERSIBLE — ZPAY ACCEPTS NO LIABILITY FOR LOSSES ARISING FROM INCORRECT TRANSACTION PARAMETERS, LOST PRIVATE KEYS, OR SMART CONTRACT BUGS IN THIRD-PARTY SOROBAN CONTRACTS.

TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZPAY'S TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM USE OF THE SERVICE SHALL NOT EXCEED USD $100.`
  },
  {
    title: '8. Modifications to Terms',
    content: `ZPAY reserves the right to modify these Terms at any time. Material changes will be communicated via email (if you have provided an email address) and via a prominent notice on the ZPAY dashboard at least 14 days prior to the change taking effect.

Continued use of the Service after the effective date of modified Terms constitutes acceptance of the revised Terms.`
  },
  {
    title: '9. Governing Law & Disputes',
    content: `These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved by good-faith negotiation. Failing that, disputes shall be submitted to binding arbitration.

For compliance-specific inquiries, contact compliance@zpay.route. For general legal matters, contact legal@zpay.route.`
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20 font-[family-name:var(--font-jakarta)]">
      <Navbar />

      <section className="pt-36 sm:pt-44 pb-16 px-4 sm:px-6 text-center max-w-[900px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Legal</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-4">Terms of Service</h1>
        <p className="text-white/40 text-sm font-medium">Last Updated: July 30, 2026 · Effective: August 1, 2026</p>
      </section>

      <section className="pb-32 px-4 sm:px-6 max-w-[800px] mx-auto">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0a0a0a] p-8 sm:p-12 space-y-10">
          <p className="text-white/60 text-base leading-relaxed font-medium border-l-2 border-amber-500/50 pl-4">
            These Terms of Service govern your access to and use of ZPAY Protocol services. Please read them carefully before using the platform.
          </p>

          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <div className="text-white/60 text-sm leading-relaxed font-medium whitespace-pre-line">
                {section.content}
              </div>
              {idx < sections.length - 1 && (
                <div className="border-t border-white/[0.06] pt-2" />
              )}
            </div>
          ))}
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
