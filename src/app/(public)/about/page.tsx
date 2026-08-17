import React from "react";
import { ShieldCheck, Zap, Sparkles, Code2, Users2, Eye } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: "High Performance",
      desc: "Speed is a core feature. We write optimized database queries, load optimized assets, and structure assets to prevent layout shifts."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-secondary" />,
      title: "Rigorous Security",
      desc: "Passwords are encrypted using bcryptjs, inputs are validated on the server side, and sessions are tracked securely via next-auth JWTs."
    },
    {
      icon: <Code2 className="w-5 h-5 text-accent" />,
      title: "Clean Architecture",
      desc: "We prioritize clean TypeScript, reusable UI modules, decoupled database utilities, and follow strict Next.js App Router guidelines."
    }
  ];

  return (
    <div className="relative min-h-screen bg-grid-pattern py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Company Story</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 tracking-tight">About Dravion</h1>
          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            A software studio dedicated to engineering high-performance SaaS applications, custom backend pipelines, and premium digital identities.
          </p>
        </div>

        {/* Narrative */}
        <div className="glass-panel-premium rounded-2xl p-8 md:p-12 mb-12 space-y-6 text-gray-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" /> Our Philosophy
          </h2>
          <p>
            Dravion was founded on the idea that high-quality software development should be combined with premium visual design. We believe that applications should not just function properly, but should also be clean, fast, and satisfying to navigate.
          </p>
          <p>
            Our flagship SaaS product, the Dravion Digital Visiting Card, is designed to replace outdated paper networking. It combines our engineering skills with a simple user flow, allowing anyone to build a customized, fast-loading digital visiting card for free.
          </p>
        </div>

        {/* Core Values */}
        <div className="space-y-6 mb-16">
          <h2 className="text-xl font-bold text-center text-white mb-8">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-xl space-y-3">
                <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  {val.icon}
                </div>
                <h3 className="text-sm font-semibold text-white">{val.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
