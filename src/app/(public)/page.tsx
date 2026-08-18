import React from "react";
import Link from "next/link";
import { ArrowRight, Laptop, Cpu, Globe, Rocket, ArrowUpRight, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dravion | High-Performance Web Agency & Free Digital Business Cards",
  description: "Dravion builds next-gen web systems, custom SaaS suites, and mobile apps. Create a professional digital visiting card for free or request a custom website design.",
  keywords: [
    "dravion",
    "visiting card for free",
    "digital visiting card",
    "online presence",
    "online pressence",
    "visiting cards",
    "digital visiting cards",
    "website costs",
    "affordable websites",
    "webapps",
    "mobile apps"
  ]
};

export default function HomePage() {
  const services = [
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Website Development",
      desc: "Stunning, fast, and SEO-optimized corporate websites built with cutting-edge frameworks."
    },
    {
      icon: <Laptop className="w-6 h-6 text-secondary" />,
      title: "SaaS Development",
      desc: "Full-scale cloud applications with secure authorization, payments, databases, and responsive admin panels."
    },
    {
      icon: <Cpu className="w-6 h-6 text-accent" />,
      title: "AI Solutions",
      desc: "Integrate LLMs, vector search, automated workflows, and smart chatbots into your business flows."
    },
    {
      icon: <Rocket className="w-6 h-6 text-emerald-400" />,
      title: "Business Automation",
      desc: "Optimize operations, connect third-party platforms, and build custom dashboards to track performance."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-grid-pattern pb-20">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-28 text-center relative z-10">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
          Building Digital Experiences <br />
          <span className="text-gradient-primary">That Grow Businesses.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
          Dravion is a modern technology studio and software studio. We design high-performance web systems, custom SaaS suites, and AI automations, and host the world's most elegant digital business cards.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all shadow-lg shadow-primary/25 cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Services</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
            What We Do Best.
          </h2>
          <p className="text-gray-400 mt-4 text-sm max-w-xl mx-auto">
            From architecture to deployment, we build top-tier software experiences tailored to your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl hover:border-primary/30 transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {srv.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{srv.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Dravion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">The Dravion Difference</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
            Why Choose Us.
          </h2>
          <p className="text-gray-400 mt-4 text-sm max-w-xl mx-auto">
            We merge premium web aesthetics with robust, modern software architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2.5"></span> Sub-second Load Times
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We compile layouts with Next.js Turbopack and pre-render content statically to ensure pages load instantly (under 200ms) on both mobile and desktop.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <span className="w-2 h-2 rounded-full bg-secondary mr-2.5"></span> Premium Visual Design
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              No boring templates. Every interface is styled with premium glassmorphism layouts, responsive elements, and custom CSS color palettes.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <span className="w-2 h-2 rounded-full bg-accent mr-2.5"></span> Live Operational Metrics
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Every profile link logs views, QR scans, and WhatsApp clicks in real-time, providing immediate engagement data in your dashboard.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2.5"></span> Robust Data Security
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sessions are guarded with encrypted JWT signatures, passwords are securely hashed, and all API calls prevent payload injection.
            </p>
          </div>
        </div>
      </section>

      {/* Setup Steps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Simple Setup</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
            Get Started in 3 Steps.
          </h2>
          <p className="text-gray-400 mt-4 text-sm max-w-xl mx-auto">
            You don't need any technical skills to launch your digital card.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold mx-auto">1</div>
            <h3 className="text-lg font-semibold text-white">Create Account</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sign up securely using your Google account or email in under 15 seconds.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary text-sm font-bold mx-auto">2</div>
            <h3 className="text-lg font-semibold text-white">Input Details</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fill in your contact links, whatsapp number, socials, and upload a profile picture.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-sm font-bold mx-auto">3</div>
            <h3 className="text-lg font-semibold text-white">Share & Track</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Instantly share your dynamic QR code or link, and watch your visitor analytics grow.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Lead Capture / Contact Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 relative z-10">
        <div className="glass-panel-premium rounded-2xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Have a custom project in mind?</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
            Let's work together to construct a digital product that elevates your company above the competition.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all"
            >
              <span>Schedule a Call</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Highlight (Digital Visiting Card SaaS) - Moved to the very end of the page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 md:mt-40 relative z-10 font-sans">
        <div className="glass-panel-premium rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Our Flagship SaaS Product</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              A Professional Visiting Card. <br />
              <span className="text-secondary">Fully Digital. Always Free.</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Ditch printing costs. Create a fast, beautiful, and mobile-optimized digital business card in under 5 minutes. Share instantly via custom link or dynamic QR code. Track page views and clicks live.
            </p>
            <ul className="space-y-3">
              {[
                "Choose from 6 premium designer templates",
                "Add click-to-contact links for WhatsApp, Email & Call",
                "Integrate social handles and service catalogs",
                "Live performance tracking & dynamic QR generation"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 mr-2.5 text-secondary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                href="/digital-card"
                className="inline-flex items-center space-x-2 bg-secondary text-background font-bold px-6.5 py-3.5 rounded-lg text-sm transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Digital Card Maker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Graphical Representation / Mockup */}
          <div className="relative flex justify-center items-center">
            <div className="absolute w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
            {/* Simulated Phone Mockup */}
            <div className="w-64 h-[440px] bg-slate-950 border-[6px] border-slate-800 rounded-[32px] overflow-hidden shadow-2xl relative">
              <div className="w-20 h-4 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20"></div>
              {/* Card Template Mockup */}
              <div className="h-full bg-[#0a0f1d] p-4 flex flex-col items-center justify-between text-center relative pt-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5 mt-2">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
                    PHOTO
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-white text-sm font-semibold">Akhilesh AS</h4>
                  <p className="text-[10px] text-gray-400">Full Stack Architect | Dravion</p>
                  <p className="text-[8px] bg-white/5 text-secondary border border-white/5 rounded-full px-2 py-0.5 inline-block font-mono">
                    dravion.site/card/a315ld
                  </p>
                </div>
                
                {/* Simulated Quick Action buttons */}
                <div className="w-full grid grid-cols-3 gap-2 my-2">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col items-center justify-center">
                    <span className="text-[8px] text-white font-semibold">Call</span>
                  </div>
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-2 flex flex-col items-center justify-center">
                    <span className="text-[8px] text-secondary font-semibold">WhatsApp</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col items-center justify-center">
                    <span className="text-[8px] text-white font-semibold">Email</span>
                  </div>
                </div>

                <div className="w-full space-y-1">
                  <div className="w-full h-1 bg-white/10 rounded-full"></div>
                  <div className="w-full h-1 bg-white/10 rounded-full w-4/5 mx-auto"></div>
                </div>
                
                {/* Logo bottom */}
                <div className="text-[8px] text-gray-500 font-semibold tracking-wider pb-1">
                  POWERED BY DRAVION
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
