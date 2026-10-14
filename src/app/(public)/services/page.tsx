import React from "react";
import Link from "next/link";
import { Globe, Server, Smartphone, Brain, Shield, Clock, HelpCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Web Development Services & Mobile App Engineering | Dravion",
  description: "Hire our software development agency for custom webapps, responsive websites, mobile apps (iOS & Android), SaaS platforms, and enterprise solutions. Affordable, fast, and scalable.",
  keywords: [
    "webapps",
    "mobile apps",
    "affordable websites",
    "website costs",
    "web development services",
    "custom software agency"
  ]
};

export default function ServicesPage() {
  const serviceCards = [
    {
      icon: <Globe className="w-8 h-8 text-primary" />,
      title: "Web Application Development",
      description: "Custom enterprise web systems built with Next.js, React, and TypeScript. Optimized for load speed, scalability, and clean UI/UX.",
      details: ["SEO optimization & Core Web Vitals", "Single Page & Server Rendered Apps", "Static & Dynamic content systems"]
    },
    {
      icon: <Server className="w-8 h-8 text-secondary" />,
      title: "SaaS Architecture & Development",
      description: "End-to-end multi-tenant architectures, complete with role authorization, custom database schemas, API routing, and subscription engines.",
      details: ["Database scaling & index optimization", "NextAuth / OAuth setup", "Cloudinary media assets upload integration"]
    },
    {
      icon: <Smartphone className="w-8 h-8 text-accent" />,
      title: "Mobile App Development",
      description: "Cross-platform iOS and Android mobile software engineered using React Native or Flutter, featuring offline functionality and notification triggers.",
      details: ["App Store & Play Store publication", "Biometric and device integrations", "Real-time updates & notifications"]
    },
    {
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      title: "AI Integration & Workflows",
      description: "Integrate LLMs, natural language vector searches, customized data agents, and backend script automation to save operational costs.",
      details: ["OpenAI & Anthropic API bridges", "RAG & Vector database pipelines", "Automated marketing & customer chats"]
    }
  ];

  return (
    <div className="relative min-h-screen bg-grid-pattern py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 w-72 sm:w-96 h-72 sm:h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 md:right-10 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Capabilities</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mt-2 tracking-tight">Our Services</h1>
          <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            We provide clean code, responsive layouts, and secure enterprise architectures. Here is how we can help your company grow.
          </p>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16 sm:mb-20">
          {serviceCards.map((service, index) => (
            <div key={index} className="glass-panel-premium p-6 sm:p-8 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5 sm:mb-6">
                  {service.icon}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-primary transition-colors">{service.title}</h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">{service.description}</p>
              </div>
              
              <div className="space-y-2 border-t border-white/5 pt-4">
                {service.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 shrink-0"></span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="glass-panel p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-white mb-8 sm:mb-10">How We Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold text-white">Discover & Plan</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We outline specifications, draw user flows, formulate implementation plans, and align on budget and timelines before code is written.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary text-sm font-bold">2</div>
              <h3 className="text-lg font-semibold text-white">Build & Preview</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Agile development cycles with continuous previews. We write clean, indexed schemas and modular frontend components.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-sm font-bold">3</div>
              <h3 className="text-lg font-semibold text-white">Deploy & Optimize</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Seamless Vercel deployment, CDN setups, performance audits, and SEO checklists to ensure a launch that performs optimally.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all"
          >
            <span>Let's Build Together</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
