import React from "react";
import Link from "next/link";
import { Check, ShieldAlert, Sparkles, Building2, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affordable Pricing & Free Digital Business Cards | Dravion",
  description: "Check Dravion pricing plans. Get a digital visiting card for free or upgrade to customized features. Find affordable website costs, SaaS pricing, and mobile app plans.",
  keywords: [
    "visiting card for free",
    "digital visiting card",
    "website costs",
    "affordable websites",
    "digital business card pricing"
  ]
};

export default function ProductsPage() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "Ideal for individual creators, freelancers, and professionals starting out.",
      features: [
        "1 Digital Business Card",
        "Standard Templates",
        "Dynamic QR Code",
        "Basic Contact buttons (Call, Email, WhatsApp)",
        "Social Links Integration",
        "Dravion Branding",
      ],
      cta: "Create Free Card",
      href: "/register",
      popular: false,
      badgeColor: "bg-white/5 text-gray-300 border-white/10"
    },
    {
      name: "Pro",
      price: "₹299/yr",
      description: "Best for consultants, executives, and scaling professionals needing advanced customization.",
      features: [
        "Up to 3 Digital Business Cards",
        "All Premium Templates",
        "Remove 'Powered by Dravion' Branding",
        "Advanced Customize options (Fonts & Accents)",
        "Advanced Analytics Graph metrics",
        "Priority Support",
      ],
      cta: "Go Pro (Coming Soon)",
      href: "/register",
      popular: true,
      badgeColor: "bg-primary/20 text-primary border-primary/30"
    },
    {
      name: "Business",
      price: "Custom",
      description: "Engineered for organizations, corporate teams, and offices to centralize employee cards.",
      features: [
        "Unlimited Employee Cards",
        "Company Centralized Admin Dashboard",
        "Team analytics & global CSV exports",
        "Custom domain integrations (card.yourcompany.com)",
        "Bulk edit templates and roles",
        "Dedicated Account Success Manager",
      ],
      cta: "Contact Enterprise",
      href: "/contact",
      popular: false,
      badgeColor: "bg-secondary/20 text-secondary border-secondary/30"
    }
  ];

  return (
    <div className="relative min-h-screen bg-grid-pattern py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">Pricing & SaaS Plans</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 tracking-tight">Our Products</h1>
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Create a fast, responsive digital card for free or upgrade to support team dashboards, custom URLs, and zero advertisement markings.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`glass-panel-premium rounded-2xl p-8 flex flex-col justify-between border relative ${
                plan.popular ? "border-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20" : "border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  Popular
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                  <p className="text-xs text-gray-400 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-xs text-gray-500 font-semibold">/ year</span>}
                </div>

                <ul className="space-y-3.5 border-t border-white/5 pt-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-xs text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={plan.href}
                  className={`w-full text-center block font-semibold py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent text-white hover:opacity-95 shadow-md shadow-primary/10"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-8 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-primary" /> Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Can I change my username later?</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Yes. You can edit card attributes and request custom usernames in dashboard settings, provided the new URL slug is not already registered.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Is there a physical card option?</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We focus entirely on the digital ecosystem. The downloadable QR code, however, can be printed on any NFC tag or physical corporate layout.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">How do QR scans log stats?</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every scan accesses the URL endpoint. This instantly schedules a logging job on the backend to count visits, device types, and click clicks.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">How long do free cards last?</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Free cards remain active indefinitely as long as your account details remain valid. We do not delete inactive user profiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
