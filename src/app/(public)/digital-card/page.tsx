import React from "react";
import Link from "next/link";
import { ArrowRight, QrCode, Smartphone, Share2, Palette, ShieldCheck, Heart } from "lucide-react";

export default function DigitalCardPage() {
  const steps = [
    {
      icon: <Palette className="w-5 h-5 text-primary" />,
      title: "1. Choose Your Theme",
      desc: "Pick from 4 layouts: Modern Dark, Minimal White, Enterprise Business, or Glassmorphic."
    },
    {
      icon: <Smartphone className="w-5 h-5 text-secondary" />,
      title: "2. Input Your Info",
      desc: "Provide email, phone numbers, bio, custom links, service lists, and upload a profile picture."
    },
    {
      icon: <QrCode className="w-5 h-5 text-accent" />,
      title: "3. Publish & Share",
      desc: "Instantly generate your dynamic web URL and high-res vector QR code. Scan or tap to send."
    }
  ];

  return (
    <div className="relative min-h-screen bg-grid-pattern py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Area */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">SaaS Solution</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2 mb-6 tracking-tight leading-tight">
            Elevate Your Networking. <br />
            <span className="text-gradient-primary">Go 100% Digital.</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Standard business cards get thrown away. A Dravion Digital Visiting Card is always accessible in your customer's browser, links directly to your WhatsApp and socials, and logs analytic scans automatically.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold px-8 py-3 rounded-lg text-sm transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <span>Build Your Free Card</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Builder walkthrough steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-base font-semibold text-white">{step.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits Comparison Grid */}
        <div className="glass-panel-premium rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative flex justify-center">
            <div className="w-72 h-[380px] bg-[#0b0f19] border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  D
                </div>
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center p-1">
                  <QrCode className="w-full h-full text-secondary" />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h3 className="text-white font-semibold text-sm">Scan to connect</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Open your camera, scan the code, or tap your NFC device. Save contacts instantly to your phone.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-gray-500 font-bold">
                <span>DRAVION.SITE</span>
                <span className="text-secondary">FREE PASS</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Why make the switch to a Dravion Digital Card?
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Save money & resources</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Stop paying for reprinting every time your contact details, job title, or handles change. Update instantly from your login dashboard.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Share2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Universal Share Features</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Share via email signatures, SMS links, WhatsApp text templates, social media bio anchors, or printing the QR on physical flyers.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Environmentally friendly</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Help reduce the massive environmental footprint of manufacturing millions of paper cards that end up in trash cans anyway.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
